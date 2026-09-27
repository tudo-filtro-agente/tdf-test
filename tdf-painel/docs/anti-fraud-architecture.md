# Sistema Antifraude Operacional (TDF) — Arquitetura

**Status:** desenho aprovado, aguardando GO pra implementação faseada
**Owner:** Paulo Camargo Jr · **Arquiteto:** tdf-portal team
**Última atualização:** 2026-05-07

---

## 1. Problema

Vendedores estão fechando tarefas no Zoho Tasks **sem executar contato real** (ligação ou WhatsApp). Resultado:

- Cadência fictícia (call/lead reportado ≠ real)
- Speed-to-lead falso
- Métricas de produtividade contaminadas
- Dashboards (Sales Director / BI) erradamente otimistas
- Decisões de gestão (premiação, redistribuição) baseadas em dado falso

**Tarefa não pode ser concluída sem evidência operacional válida.**

---

## 2. Restrição estrutural (decisão arquitetural)

Zoho CRM **não suporta hook PRE-save** em Tasks. Não dá pra "bloquear" a conclusão na hora — só **detectar e reverter**.

A solução adotada é:

```
Vendedor marca Task = Completed no Zoho
       ↓
Zoho Workflow Rule dispara webhook → tdf-portal
       ↓
tdf-portal valida evidência (Calls + WATI)
       ↓
Tem evidência? → APROVA (audit log)
SEM evidência?  → REVERTE (Status volta pra "In Progress")
                  + cria Note "Bloqueado: sem evidência"
                  + alerta gestor no Cliq
```

**Janela de detecção:** ≤30 segundos após o vendedor clicar "Concluído". Suficiente pra impedir reportar como real.

---

## 3. Arquitetura em camadas

```
┌─────────────────────────────────────────────────┐
│  ZOHO CRM (source of truth de Tasks)            │
│  - Workflow: Task.Status changed → webhook      │
└─────────────────────────────────────────────────┘
                    ↓ HTTPS POST signed
┌─────────────────────────────────────────────────┐
│  tdf-portal (Express + Postgres) — Núcleo       │
│  ┌───────────────────────────────────────────┐  │
│  │  /webhook/zoho/task    (entrada async)    │  │
│  │     ↓                                     │  │
│  │  job queue (in-memory ring + retry)       │  │
│  │     ↓                                     │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  TaskValidator  (orquestrador)      │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  EvidenceFinder                     │  │  │
│  │  │   ├── GoToCallSearch  (calls)       │  │  │
│  │  │   └── WatiMessageSearch (msgs)      │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  FraudDetector (heurísticas R1-R8)  │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  Decision (valid|block|exception)   │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  AuditLogger (Postgres)             │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  TaskReverter (se block)            │  │  │
│  │  │   ↓                                 │  │  │
│  │  │  AlertDispatcher (Cliq + WhatsApp)  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
            ↑                       ↑
            │                       │
   ┌────────────────┐    ┌──────────────────┐
   │  GoTo Connect  │    │   WATI            │
   │  (calls log)   │    │   (msgs log)      │
   └────────────────┘    └──────────────────┘

   Cache de evidências em Redis-like (in-memory) — TTL 5 min
   Detecção offline (cron a cada 5min) — backup pra perdas de webhook
```

---

## 4. Banco de dados (Postgres)

Já temos `kv_store` no tdf-portal mas é simples demais. Antifraude precisa de **schemas dedicados** com índices:

```sql
-- 1. Validações de tarefas
CREATE TABLE task_validations (
  id BIGSERIAL PRIMARY KEY,
  zoho_task_id    VARCHAR(50) NOT NULL UNIQUE,
  zoho_deal_id    VARCHAR(50),
  owner_email     VARCHAR(120) NOT NULL,
  owner_name      VARCHAR(120),
  phone           VARCHAR(20),
  subject         TEXT,
  status          VARCHAR(30) NOT NULL,    -- 'pending'|'valid'|'blocked'|'exception_requested'|'exception_approved'
  evidence_kind   VARCHAR(20),             -- 'call'|'whatsapp'|'exception'|NULL
  evidence_id     VARCHAR(120),            -- ID da call/msg externa
  evidence_score  SMALLINT,                -- 0-100
  task_completed_at  TIMESTAMPTZ NOT NULL,
  validated_at       TIMESTAMPTZ DEFAULT NOW(),
  blocked_reason     TEXT,
  blocked_payload    JSONB,                -- snapshot da tentativa
  reverted_at        TIMESTAMPTZ
);
CREATE INDEX idx_tv_owner_completed ON task_validations(owner_email, task_completed_at DESC);
CREATE INDEX idx_tv_status ON task_validations(status);
CREATE INDEX idx_tv_deal ON task_validations(zoho_deal_id);

-- 2. Snapshot da evidência (audit imutável)
CREATE TABLE evidence_snapshots (
  id BIGSERIAL PRIMARY KEY,
  validation_id   BIGINT REFERENCES task_validations(id) ON DELETE CASCADE,
  source          VARCHAR(20) NOT NULL,    -- 'goto'|'wati'|'manual'
  external_id     VARCHAR(120),
  payload_json    JSONB NOT NULL,
  fetched_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_es_validation ON evidence_snapshots(validation_id);
CREATE INDEX idx_es_external ON evidence_snapshots(source, external_id);

-- 3. Red flags antifraude
CREATE TABLE fraud_flags (
  id BIGSERIAL PRIMARY KEY,
  owner_email     VARCHAR(120) NOT NULL,
  flag_type       VARCHAR(40) NOT NULL,    -- 'no_log'|'short_call'|'mass_complete'|'wrong_phone'|'wrong_owner'|'evidence_reuse'|'timing_anomaly'
  severity        VARCHAR(10) NOT NULL,    -- 'low'|'medium'|'high'|'critical'
  task_id         VARCHAR(50),
  validation_id   BIGINT REFERENCES task_validations(id),
  details_json    JSONB,
  resolved        BOOLEAN DEFAULT FALSE,
  resolved_by     VARCHAR(120),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ff_owner_open ON fraud_flags(owner_email, resolved, created_at DESC);
CREATE INDEX idx_ff_severity ON fraud_flags(severity, created_at DESC) WHERE resolved = FALSE;

-- 4. Exceções aprovadas
CREATE TABLE exception_grants (
  id BIGSERIAL PRIMARY KEY,
  zoho_task_id    VARCHAR(50) NOT NULL,
  requested_by    VARCHAR(120) NOT NULL,
  approved_by     VARCHAR(120),
  status          VARCHAR(20) NOT NULL,    -- 'pending'|'approved'|'rejected'
  reason          TEXT NOT NULL,
  observation     TEXT,
  approval_payload JSONB,
  requested_at    TIMESTAMPTZ DEFAULT NOW(),
  decided_at      TIMESTAMPTZ
);
CREATE INDEX idx_eg_status ON exception_grants(status, requested_at DESC);

-- 5. Score operacional diário (rebuild via cron 23:55 BRT)
CREATE TABLE operator_daily_score (
  owner_email     VARCHAR(120) NOT NULL,
  ymd             DATE NOT NULL,
  tasks_total     INT,
  tasks_valid     INT,
  tasks_blocked   INT,
  tasks_exception INT,
  calls_count     INT,
  calls_avg_dur   INT,
  whatsapp_count  INT,
  flags_count     INT,
  real_exec_pct   SMALLINT,        -- 0-100
  cadence_pct     SMALLINT,
  ops_quality     SMALLINT,
  followup_pct    SMALLINT,
  overall_score   SMALLINT,        -- 0-100, fórmula no service
  PRIMARY KEY (owner_email, ymd)
);
CREATE INDEX idx_ods_ymd ON operator_daily_score(ymd, overall_score DESC);
```

---

## 5. Camada de serviços (Node.js)

Estrutura proposta dentro de `tdf-portal/`:

```
services/
├── anti-fraud/
│   ├── task-validator.js         # orquestrador principal
│   ├── evidence-finder.js        # busca calls + msgs
│   ├── goto-call-search.js       # adapter GoTo
│   ├── wati-message-search.js    # adapter WATI
│   ├── fraud-detector.js         # R1-R8 heurísticas
│   ├── audit-logger.js           # registra Postgres
│   ├── task-reverter.js          # reverte status no Zoho
│   ├── alert-dispatcher.js       # Cliq + WhatsApp
│   ├── exception-flow.js         # aprovação de exceções
│   ├── operator-score.js         # cálculo diário
│   └── job-queue.js              # in-memory + retry
routes/
├── webhook-zoho-task.js
├── anti-fraud.js                 # GET dashboards, POST exceções
db/
└── migrations/
    └── 002-anti-fraud.sql
```

---

## 6. Fluxo de validação detalhado

### 6.1 Task concluída no Zoho

```javascript
// POST /webhook/zoho/task
// Headers: X-Zoho-Signature: HMAC-SHA256(body, secret)
// Body: { event: 'task.updated', data: { id, Status, Owner, What_Id, Description, ...} }

router.post('/webhook/zoho/task', async (req, res) => {
  // 1. Verifica signature (anti-spoof)
  if (!verifyZohoSignature(req)) return res.status(401).end();
  
  // 2. Filtra: só Status='Completed' nos interessa
  const t = req.body.data;
  if (t.Status !== 'Completed') return res.status(204).end();
  
  // 3. Encola job (não bloqueia webhook)
  jobQueue.push({ kind: 'validate_task', payload: t, retries: 0 });
  res.status(202).json({ queued: true });
});
```

### 6.2 Worker validador

```javascript
async function validateTask(t) {
  const ownerEmail = t.Owner.email;
  const dealId = t.What_Id?.id;
  const phone = await fetchDealPhone(dealId);
  const completedAt = new Date(t.Modified_Time);

  // Janela: -30min a +30min em torno do completedAt
  const windowStart = new Date(completedAt.getTime() - 30*60*1000);
  const windowEnd   = new Date(completedAt.getTime() + 30*60*1000);

  // EVIDENCE FINDER
  const callEvidence = await searchGoToCalls({
    ownerEmail, phone, windowStart, windowEnd,
    minDurationSec: parseInt(process.env.AF_MIN_CALL_SEC || '15'),
  });
  const whatsAppEvidence = await searchWatiMessages({
    ownerEmail, phone, windowStart, windowEnd,
  });

  let decision = { status: 'blocked', reason: 'no_evidence' };
  let evidence = null;

  if (callEvidence.length > 0) {
    evidence = { kind: 'call', ...callEvidence[0] };
    decision = { status: 'valid' };
  } else if (whatsAppEvidence.length > 0) {
    evidence = { kind: 'whatsapp', ...whatsAppEvidence[0] };
    decision = { status: 'valid' };
  }

  // FRAUD DETECTOR (rodar mesmo se valid, pra raise flags)
  const flags = await runFraudHeuristics({ task: t, evidence, ownerEmail, phone });

  // AUDIT LOG
  const validationId = await auditLogger.insertValidation({
    task: t, decision, evidence, flags
  });

  // REVERT se blocked
  if (decision.status === 'blocked') {
    await zohoTaskReverter.revertToInProgress(t.id, validationId);
    await alertDispatcher.notifyOwner(ownerEmail, t.Subject, decision.reason);
    await alertDispatcher.notifyManagement(t, decision, flags);
  } else if (flags.length > 0) {
    await alertDispatcher.notifyManagement(t, decision, flags);
  }

  return { validationId, decision, flagsCount: flags.length };
}
```

### 6.3 Reverter no Zoho

```javascript
async function revertToInProgress(taskId, validationId) {
  await zohoApi.put(`/Tasks/${taskId}`, {
    data: [{ id: taskId, Status: 'In Progress' }]
  });
  // Cria Note de auditoria
  await zohoApi.post(`/Tasks/${taskId}/Notes`, {
    data: [{
      Note_Title: '🚨 Bloqueado: sem evidência operacional',
      Note_Content: `Task revertida automaticamente pelo sistema antifraude.\nValidation ID: ${validationId}\nNenhuma ligação ≥15s nem mensagem WATI encontrada na janela ±30min.`
    }]
  });
}
```

---

## 7. Heurísticas de fraude (R1-R8)

| ID | Regra | Severidade | Ação |
|---|---|---|---|
| **R1** | Task completed sem evidência | **High** | Bloqueia + reverte |
| **R2** | Ligação <15s | Medium | Flag + score reduz |
| **R3** | >5 tasks concluídas em <5min (mass_complete) | High | Flag + alerta gestor |
| **R4** | Ligação pra número ≠ Telefone_contato do deal | Medium | Flag |
| **R5** | Vendedor concluindo task de outro vendedor | High | Flag + bloqueia |
| **R6** | Mesma evidência (call_id) reusada em ≥2 tasks | Critical | Flag + bloqueia |
| **R7** | Janela timing anômala (task.completed antes da call existir) | Critical | Flag + bloqueia |
| **R8** | Vendedor com >50% tasks completed sem evidência (rolling 7d) | Critical | Alerta diário gestor |

---

## 8. Score operacional (fórmula)

```
overall_score = 0.30 × real_exec_pct
              + 0.25 × cadence_pct
              + 0.20 × ops_quality
              + 0.15 × followup_pct
              + 0.10 × clean_record_pct (1 - flags/tasks)

real_exec_pct   = tasks_valid / tasks_total           (% de execução real)
cadence_pct     = atingimento da meta diária de toques (calls+msgs / lead.target)
ops_quality     = média (call_dur ≥ 60s) + (msg_count ≥ 3)
followup_pct    = tasks com followup criado em D+1
```

Recalculado diariamente às **23:55 BRT** via cron.

---

## 9. APIs e endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/webhook/zoho/task` | Recebe webhook Zoho (signed) |
| POST | `/webhook/goto/call` | Recebe webhook GoTo (cache de calls) |
| POST | `/antifraud/exception/request` | Vendedor pede exceção (com motivo + obs) |
| POST | `/antifraud/exception/:id/approve` | Gestor aprova/rejeita |
| GET | `/antifraud/operator/:email/score` | Score atual + histórico 30d |
| GET | `/antifraud/operator/:email/tasks` | Drill-down tarefas (valid/blocked/exception) |
| GET | `/antifraud/flags` | Lista flags abertos (filtros: severity, owner, dateRange) |
| POST | `/antifraud/recheck/:taskId` | Re-validação manual |
| GET | `/antifraud/audit/:validationId` | Snapshot completo (immutable) |
| GET | `/admin/anti-fraud` | Dashboard EJS |

---

## 10. UX (modal de bloqueio)

Como o Zoho CRM não permite custom modal nativo, o **Portal TDF (`/cockpit`, `/inbox`) intercepta antes**:

```
[ Vendedor clica "Concluir Task" no Portal TDF ]
       ↓
Portal envia POST /antifraud/precheck
       ↓
Backend roda EvidenceFinder
       ↓
SEM evidência? → modal:
   "🚫 Não encontramos evidência operacional válida"
   "Necessário: ligação ≥15s OU mensagem WATI na janela ±30min"
   [Tentar novamente] [Pedir exceção]
COM evidência → permite POST /Tasks/{id}/Status=Completed direto Zoho
```

Pro Zoho CRM em si (web/app oficial) — onde não dá pra interceptar — fica o **fluxo reverter**: vendedor marca completed, sistema detecta em <30s, reverte e notifica.

---

## 11. Plano de implementação faseado

### Fase 1 — Fundação (5 dias)
- ✅ Schema Postgres (migration 002)
- ✅ `services/anti-fraud/audit-logger.js`
- ✅ `services/anti-fraud/evidence-finder.js` + adapters
- ✅ Webhook Zoho `/webhook/zoho/task` (apenas log, não reverte ainda)
- ✅ Cron polling Zoho Tasks Status=Completed (backup do webhook)
- **Saída:** todas as completions do dia logadas com evidence_status

### Fase 2 — Bloqueio + Modal (5 dias)
- ✅ `services/anti-fraud/task-reverter.js`
- ✅ `services/anti-fraud/alert-dispatcher.js`
- ✅ Modal no portal `/cockpit`, `/inbox` (precheck antes de POST Zoho)
- ✅ Heurísticas R1-R3 implementadas
- ✅ Endpoint `POST /antifraud/exception/request` + flow
- **Saída:** bloqueio em produção (com kill switch via env `AF_ENABLE=true`)

### Fase 3 — Detecção avançada + Dashboards (4 dias)
- ✅ R4-R8 heurísticas
- ✅ `services/anti-fraud/operator-score.js` + cron diário
- ✅ Dashboard `/admin/anti-fraud`
- ✅ Drill-down por vendedor
- ✅ Auditoria search

### Fase 4 — Integração Sales Director + ZK (3 dias)
- ✅ Score real injetado em `/gestao` (Torre)
- ✅ Routine diário Cliq com top flags
- ✅ Documentação operacional (Obsidian)

**Total estimado: 17 dias úteis** com 1 dev focado.

---

## 12. Configuração / kill switch

Env vars novas:

```
AF_ENABLE=false                    # liga/desliga sistema (default off)
AF_MIN_CALL_SEC=15                 # duração mínima
AF_WINDOW_MIN=30                   # janela ±30min
AF_REVERT_ENABLED=false            # se reverte ou só alerta (modo shadow)
AF_EXCEPTION_AUTO_APPROVE=false    # exceções precisam aprovação humana
AF_ZOHO_WEBHOOK_SECRET=xxx         # HMAC pra signature
AF_ALERT_CLIQ_CHANNEL=alertasfraude
```

**Modo SHADOW (Fase 1)**: sistema observa e logga TUDO, mas não reverte nem alerta — pra calibrar threshold antes de ligar bloqueio.

---

## 13. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| GoTo API instável → falsos negativos | Fallback pra Tasks já criadas + janela mais larga (60min) |
| WATI 429 rate limit | Cache + retry exponencial |
| Vendedor liga de outro número (celular pessoal) | Permitir cadastro de "número alternativo" no perfil + flag automática |
| Zoho webhook perde evento | Cron polling 5min como backup |
| Falsa positivação trava operação | Modo SHADOW antes; kill switch `AF_ENABLE=false` |
| Exceções viram regra | Limite 5 exceções/vendedor/dia, alerta gestor |

---

## 14. Métricas de sucesso

Após 30 dias rodando em produção:

- **% tasks com evidência válida >= 90%** (vs ~? hoje)
- **Calls médias/lead/semana sobe** (esperado +30-50% por gabriel ferreira/tiago)
- **Alertas de mass_complete cai pra zero**
- **Score operacional diferencia top performer (Cátia, Júlia) de gargalo (Gabriel Ferreira)**
- **Sales Director vai usar score real, não fictício**
