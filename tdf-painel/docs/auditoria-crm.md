# Auditoria CRM — Manual de logging

Tudo que mexe no CRM precisa registrar. Esse documento mostra exatamente como
**Claude (Diretor IA)**, **Núbia (SDR IA)** e workflows **n8n / Z-API / WATI / Zoho Flow**
devem chamar a API de auditoria.

## Endpoint

```
POST /api/auditoria-crm/log
Content-Type: application/json
```

Em produção, autenticar com:

```
x-tdf-svc-key: $TDF_AUDIT_SVC_KEY
```

## Payload mínimo

```json
{
  "action_type": "task_completed",
  "action_origin": "seller_manual",
  "crm_module": "Tasks"
}
```

## Payload completo (recomendado)

```json
{
  "occurred_at": "2026-05-07T14:32:00-03:00",
  "crm_module": "Leads",
  "crm_record_id": "5294810000123456",
  "crm_record_name": "João Silva - Recife",
  "action_type": "lead_assigned",
  "action_origin": "claude_director_ia",
  "actor_id": "claude-v1",
  "actor_name": "Claude Director",
  "seller_responsible_before": null,
  "seller_responsible_after": "Guilherme",
  "field_changed": "Owner",
  "old_value": null,
  "new_value": "Guilherme",
  "reason": "Roteamento por produto + carga + score",
  "rule_triggered": "distribuicao_inteligente_v2",
  "confidence_score": 82,
  "related_channel": "WhatsApp",
  "validation_status": "valid",
  "impact_type": "positive",
  "commercial_impact": "acelerou atendimento",
  "crm_record_url": "https://crm.zoho.com/crm/.../Leads/5294810000123456",
  "metadata_json": {
    "tier": "Diamante",
    "amount": 5800,
    "produto": "Bebedouro Industrial 100L",
    "cidade": "Recife"
  }
}
```

## Vocabulário oficial

### `action_origin` — quem fez a ação

| valor | usar quando… |
|---|---|
| `claude_director_ia` | Claude (Diretor IA) decidiu/executou |
| `nubia_sdr_ia` | Núbia (SDR IA) decidiu/executou |
| `n8n_automation` | Workflow n8n |
| `zoho_flow` | Regra do Zoho Flow |
| `wati` | API/webhook WATI |
| `zapi` | API/webhook Z-API |
| `goto` | Ação registrada via GoTo |
| `salesiq` | SalesIQ (chat web) |
| `seller_manual` | Vendedor mexeu manualmente |
| `manager_manual` | Gestor (Paulo, Luis, etc.) mexeu manualmente |
| `system` | Sistema técnico (cron, healthcheck, fallback) |

### `action_type` — o que aconteceu

```
lead_created           lead_assigned          lead_qualified
owner_changed          stage_changed          field_updated
task_created           task_completed         task_deleted
call_logged            whatsapp_message_sent
proposal_created       proposal_sent
deal_won               deal_lost
note_created
automation_triggered
ia_recommendation_created
ia_action_executed
```

### `validation_status`

- `valid` — ação correta dentro do processo
- `suspicious` — possível burla / falta de prova
- `error` — falhou tecnicamente
- `pending_review` — dados incompletos, gestor analisar

### `impact_type`

- `positive` — moveu o ponteiro pra frente
- `neutral` — mudou estado, sem consequência clara
- `negative` — atrapalhou ou perdeu dinheiro
- `unknown` — ainda não dá pra dizer

---

## Receitas prontas

### 1. Claude criou tarefa pra vendedor

```js
await fetch(BASE + '/api/auditoria-crm/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-tdf-svc-key': SVC_KEY },
  body: JSON.stringify({
    action_type: 'task_created',
    action_origin: 'claude_director_ia',
    actor_name: 'Claude Director',
    crm_module: 'Tasks',
    crm_record_id: leadId,
    crm_record_name: leadName,
    seller_responsible_after: ownerName,
    reason: 'Lead esfriando — last touch >48h',
    rule_triggered: 'cooldown_detector',
    confidence_score: 78,
    impact_type: 'neutral',
    metadata_json: { sugestao: 'send_followup_template_v2', sla_horas: 4 }
  })
});
```

### 2. Núbia qualificou lead

```js
await audit.log({
  action_type: 'lead_qualified',
  action_origin: 'nubia_sdr_ia',
  actor_name: 'Núbia AI',
  crm_module: 'Leads',
  crm_record_id: leadId,
  crm_record_name: leadName,
  field_changed: 'Stage',
  old_value: 'Novo',
  new_value: 'Qualificado',
  reason: 'SPIN concluído: dor identificada, decisor confirmado, timing 30 dias',
  rule_triggered: 'nubia_spin_completo',
  confidence_score: 88,
  impact_type: 'positive',
  metadata_json: { sintomas: ['água amarelada'], decisor: 'sim', timing: '30d' }
});
```

### 3. n8n disparou automação (sucesso)

```js
await audit.log({
  action_type: 'automation_triggered',
  action_origin: 'n8n_automation',
  actor_name: 'Workflow CTWA Polling',
  crm_module: 'Leads',
  crm_record_id: leadId,
  crm_record_name: leadName,
  reason: 'Polling Zoho → Núbia (CTWA bebedouro)',
  validation_status: 'valid',
  impact_type: 'positive',
  metadata_json: { workflow_id: 'wf_polling_ctwa', execution_id: '12345', duration_ms: 850 }
});
```

### 4. n8n disparou automação (erro)

```js
await audit.log({
  action_type: 'automation_triggered',
  action_origin: 'n8n_automation',
  actor_name: 'Workflow Zoho Update',
  crm_module: 'Leads',
  crm_record_id: leadId,
  reason: 'ECONNREFUSED ao chamar Zoho API',
  validation_status: 'error',
  impact_type: 'negative',
  metadata_json: { workflow_id: 'wf_zoho_update', error_stack: '...' }
});
```

### 5. Vendedor concluiu task

```js
// dispare ESTE log toda vez que o webhook do Zoho avisar task_completed
await audit.log({
  action_type: 'task_completed',
  action_origin: 'seller_manual',
  actor_name: ownerName,
  seller_responsible_after: ownerName,
  crm_module: 'Tasks',
  crm_record_id: taskId,
  crm_record_name: taskSubject,
  reason: 'Cliente respondeu via WhatsApp',
  // engine de regras vai cruzar com call_logged + whatsapp_message_sent
  // e marcar como suspicious automaticamente se não houver prova.
});
```

### 6. WATI: mensagem enviada

```js
await audit.log({
  action_type: 'whatsapp_message_sent',
  action_origin: 'wati',
  actor_name: senderName,
  crm_module: 'Leads',
  crm_record_id: leadId,
  related_channel: 'WhatsApp',
  metadata_json: { template_id: 'ia_followup_24h', wati_id: messageId }
});
```

### 7. GoTo: ligação registrada

```js
await audit.log({
  action_type: 'call_logged',
  action_origin: 'goto',
  actor_name: ownerName,
  seller_responsible_after: ownerName,
  crm_module: 'Leads',
  crm_record_id: leadId,
  related_channel: 'GoTo',
  metadata_json: { duracao_seg: 543, gravacao_url: '...' }
});
```

### 8. Claude recomendou (mas não executou)

```js
await audit.log({
  action_type: 'ia_recommendation_created',
  action_origin: 'claude_director_ia',
  actor_name: 'Claude Director',
  crm_module: 'Leads',
  crm_record_id: leadId,
  reason: 'Sugiro cobrar proposta agora; última msg foi anteontem.',
  rule_triggered: 'cooldown_detector',
  confidence_score: 78,
  metadata_json: { sugestao: 'send_template', tempo_decorrido_h: 50 }
});
```

A engine vai abrir alerta `claude_recommendation_ignored` se ninguém logar
`ia_action_executed` no mesmo `crm_record_id` em 24h.

### 9. Vendedor executou recomendação Claude

```js
await audit.log({
  action_type: 'ia_action_executed',
  action_origin: 'seller_manual',
  actor_name: ownerName,
  seller_responsible_after: ownerName,
  crm_module: 'Leads',
  crm_record_id: leadId,
  reason: 'Vendedor executou recomendação do Claude',
  metadata_json: { recommendation_log_id: 9876 }
});
```

---

## Regras de ouro

1. **Nenhuma ação no CRM sem log.** Vale pra IA, n8n, Zoho Flow, e idealmente também pra ações humanas (via webhook do Zoho).
2. **Toda mudança de etapa** precisa de `old_value` + `new_value`.
3. **Toda troca de owner** precisa de `seller_responsible_before` + `seller_responsible_after`.
4. **Recomendação Claude** = `ia_recommendation_created`. Execução = `ia_action_executed` com mesmo `crm_record_id`.
5. **Distribuição** precisa de `rule_triggered` (qual regra escolheu o vendedor).
6. **Lead pago** precisa de `related_channel` ∈ {Meta Ads, Google Ads, …} pro SLA ser monitorado.
7. **Falha de automação** = `validation_status: "error"` + `reason` explicativo.
8. **Dados incompletos**: marque `validation_status: "pending_review"` em vez de cair em silêncio.

---

## Helper Node (uso interno do portal)

Se já estiver dentro do `tdf-portal`, dispense HTTP e chame direto:

```js
const audit = require('./lib/auditoria-crm');
await audit.log({ ... });
await audit.emitAlert({ ... });
```

O módulo conecta no Postgres automaticamente (usa `DATABASE_URL`).

---

## Engine de regras (já roda automático)

A cada **10 min** o módulo roda `runAllRules()` que detecta:

1. Tarefa concluída sem ligação/mensagem ±30min
2. Lead descartado em <10min após distribuição
3. Lead quente (Diamante/Ouro) sem contato >60min
4. Proposta sem follow-up >24h
5. Mudança de etapa sem nota
6. Perda sem motivo válido (vazio ou <12 chars)
7. Lead redistribuído ≥3× em 14 dias
8. Lead alto-ticket (≥R$5k) parado >48h
9. Recomendação Claude ignorada >24h
10. Núbia qualificou e closer não tocou >2h
11. Vendedor concluiu rajada de 5+ tasks em 1h
12. 5+ perdas no mesmo dia pelo mesmo vendedor
13. Lead pago sem contato dentro do SLA (30min)
14. Lead atribuído sem owner >6h
15. Erro em automação nas últimas 24h

Pra disparar manualmente:

```
POST /api/auditoria-crm/admin/run-rules
```

---

## Variáveis de ambiente

| variável | obrigatório | uso |
|---|---|---|
| `DATABASE_URL` | sim | Postgres do portal |
| `TDF_AUDIT_SVC_KEY` | recomendado | chave de serviço pra POST externo |
| `TDF_AUDIT_SEED` | opcional | `1` planta mock no boot se DB vazio |
