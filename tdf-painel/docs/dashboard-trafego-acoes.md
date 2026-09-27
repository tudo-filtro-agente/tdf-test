# Dashboard de Tráfego TDF — Ações Executáveis + Gestor IA

**Versão:** 1.0 · **Data:** 2026-04-29
**Complemento de:** `dashboard-trafego-blueprint.md`
**Princípio inviolável:** NENHUMA pause/redução agressiva sem cruzar Zoho CRM (90d + pipeline ativo).

---

## 1. Ações no Dashboard v1

Todas as ações: `Authorization: Bearer <portal_jwt>` + `X-Action-Reason: <texto livre obrigatório>`. Resposta sempre devolve `{ ok, action_id, undo_token, undo_expires_at, prev_value, new_value }`.

| # | Ação | Endpoint | Pré-condições | UI | Confirmação | Undo |
|---|------|----------|---------------|----|-----------|----|
| 1 | Pause campaign Google | `POST /trafego/google/campaign/:id/pause` | (a) `pipeline_ativo_R$ < threshold` (ver §2); (b) `cliques_30d > 50`; (c) campanha `ENABLED`; (d) reason texto ≥ 20 chars | Dropdown `⋮` na linha da tabela campanhas + botão vermelho no Red Flag Card | DUPLA: modal com pipeline ativo + lista deals abertos + checkbox "li e confirmo" | Sim, 24h |
| 2 | Pause campaign Meta | `POST /trafego/meta/campaign/:id/pause` | mesmo de #1, matching por `meta_campaign_id ↔ utm_campaign` ou Lead Ads form_id | idem | DUPLA | Sim, 24h |
| 3 | Adjust budget (preset -30%/-50%/+20%/+50%) | `POST /trafego/:platform/campaign/:id/budget` body `{ delta_pct, custom_amount }` | (a) campanha ENABLED; (b) se `delta_pct < -30`, exige reason ≥ 40 chars; (c) novo budget ≥ R$30/dia | Botões inline na linha (`-30 -50 +20 +50 ...`) | -30%: simples · -50%/+50%: dupla · custom: dupla | Sim, 6h |
| 4 | Adjust tCPA (Google) | `POST /trafego/google/campaign/:id/tcpa` body `{ delta_pct, custom_brl }` | (a) bidding_strategy_type = `TARGET_CPA` ou `MAXIMIZE_CONVERSIONS`; (b) se delta > ±20% → dupla | Modal lateral "Ajuste fino" | ±10% simples · >±20% dupla | Sim, 6h |
| 5 | Pause keyword | `POST /trafego/google/keyword/:criterion_id/pause` body `{ ad_group_id }` | (a) keyword `ENABLED`; (b) `cliques_30d ≥ 30 E conversions = 0`; (c) NÃO permitir se Quality Score ≥ 8 sem reason ≥ 30 chars | Tabela "Keywords desperdício" | Simples (impacto baixo) | Sim, 24h |
| 6 | Add negative keyword | `POST /trafego/google/negative-keyword` body `{ scope: "campaign"\|"shared_list", target_id, text, match_type }` | (a) texto ≥ 2 palavras OU exact; (b) checar lista compartilhada existente pra evitar dup | Botão "Bloquear" em linha de Search Term | Simples | Sim, 7d (remoção do negative) |
| 7 | Pause ad creative Meta | `POST /trafego/meta/ad/:id/pause` | (a) ad ACTIVE; (b) campanha tem ≥ 2 ads ativos no mesmo ad set (não deixar órfão) | Card de criativo na aba Meta | Simples | Sim, 24h |

### NÃO entram no v1
- Criar campanha (complexo, fluxo dedicado)
- Editar audiences/Custom Audiences Meta
- Criar/editar conversion actions Google
- Subir criativo novo Meta (upload de mídia)
- Mudar bidding strategy de tipo (ex: tCPA → tROAS)

---

## 2. Approval Gate — Cross-check Zoho CRM

**Pipeline executada toda action de PAUSE e toda redução `delta_pct ≤ -40%`:**

```
1. Identificar campaign_signature (slug normalizado da campanha):
   ex: "Google Ads · Bebedouro · MAX_CONVERSIONS"
   → normalize: lower + sem acento + replace(/[·\-]/g, " ") + trim + collapse spaces
   → "google ads bebedouro max conversions"

2. Query Zoho COQL:
   SELECT id, Amount, Stage, Created_Time, Lead_Source, Contact_Name
   FROM Deals
   WHERE Stage NOT IN ('Closed Lost', 'Fechado Perdido')
     AND Created_Time >= LAST_90_DAYS
     AND Lead_Source LIKE '%<token1>%'
     AND Lead_Source LIKE '%<token2>%'
   (tokens = palavras significativas do signature, ex: ["bebedouro","google"])

3. Calcular pipeline_ativo_R$ = SUM(Amount) onde Stage IN
   ('Qualificado','Visita Agendada','Proposta','Negociacao')

4. Aplicar threshold:
```

| Tipo de produto na campanha | Threshold pipeline | Justificativa |
|---|---|---|
| Bebedouro (ticket ~R$2k) | **R$ 8.000** (≥4 deals abertos) | 4 negócios em ciclo justifica manter no ar |
| Filtro Entrada (ticket R$5-15k) | **R$ 15.000** (≥1-2 deals) | Ciclo 30d, 1 deal já paga budget mensal |
| Mix/desconhecido | **R$ 10.000** (default conservador) | Fallback seguro |
| Brand/institucional | **R$ 0** (sempre liberado) | Brand não pausa por pipeline, pausa por outra razão |

**Regras de bloqueio:**
- Se `pipeline_ativo ≥ threshold` → response `403 PIPELINE_PROTECTED` com payload `{ pipeline_ativo_brl, deals_count, deals: [{id, amount, stage, age_days}], alternativa: "reduce_budget_30" }`
- Frontend renderiza modal "Não é seguro pausar — você tem R$X em pipeline. Reduzir 30% ao invés disso?" com CTA pro endpoint #3.
- Override admin: header `X-Force-Override: <senha_master>` permite passar (loga como `forced=true` no audit). Só Paulo tem.

**Edge case Meta Lead Ads (atribuição cega — 5/6 campanhas):**
matching adicional via `WATI messageReferral.headline` ou `Origem_Detalhada`. Se signature não bate em nenhum lugar → assume `pipeline_unknown` e BLOQUEIA pause sempre, oferece reduce_budget como alternativa. Documentado em `project_meta_leadgen_atribuicao_cega.md`.

---

## 3. Audit Log — `trafego_actions_log`

Storage: tabela Postgres (Railway) ou JSON em `data/audit/YYYY-MM/actions.jsonl` (append-only) — recomendado Postgres pra query.

```sql
CREATE TABLE trafego_actions_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id       TEXT UNIQUE NOT NULL,         -- exposto pro frontend p/ undo
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_email     TEXT NOT NULL,                -- de req.user
  actor_role      TEXT NOT NULL,                -- admin|gestor|closer|ia
  source          TEXT NOT NULL,                -- "dashboard_ui"|"agent_ia"|"api"
  platform        TEXT NOT NULL,                -- "google"|"meta"
  action_type     TEXT NOT NULL,                -- "pause_campaign"|"adjust_budget"|...
  target_type     TEXT NOT NULL,                -- "campaign"|"ad_group"|"keyword"|"ad"
  target_id       TEXT NOT NULL,
  target_name     TEXT,
  prev_value      JSONB,                        -- {budget_brl: 600, status:"ENABLED"}
  new_value       JSONB,
  reason          TEXT NOT NULL,                -- X-Action-Reason header
  pipeline_check  JSONB,                        -- {ativo_brl, deals_count, threshold, blocked}
  forced          BOOLEAN DEFAULT FALSE,        -- se usou X-Force-Override
  undo_token      TEXT,
  undo_expires_at TIMESTAMPTZ,
  undone_at       TIMESTAMPTZ,
  undone_by       TEXT,
  ip              INET,
  user_agent      TEXT
);

CREATE INDEX idx_actions_actor   ON trafego_actions_log(actor_email, created_at DESC);
CREATE INDEX idx_actions_target  ON trafego_actions_log(platform, target_id, created_at DESC);
CREATE INDEX idx_actions_recent  ON trafego_actions_log(created_at DESC);
```

**TTL:** 365 dias (delete `created_at < now() - interval '1 year'` em cron mensal). Antes do delete, dump JSON pra `data/archive/audit/YYYY.jsonl.gz`.

**Visualização (rota `/trafego/audit`):**
- `admin` (Paulo): vê tudo, pode desfazer qualquer action dentro da janela de undo
- `gestor` (Luis): vê tudo, desfaz só as próprias
- `closer` (vendedores): NÃO acessam `/trafego/audit` — não é o ofício deles
- `ia` (Gestor IA agent): write-only, não acessa UI

---

## 4. Gestor de Tráfego IA — Agent Live

Worker Node separado (`workers/gestor-trafego.js`), cron + on-demand via botão "Refresh sugestões" na home do dashboard.

### 4.1 System Prompt

```
Você é o Gestor de Tráfego IA da Tudo de Filtro. Stack: Google Ads (~R$45-60k/mês) + Meta Ads (~R$22k/mês). Ticket médio: bebedouro R$2k, filtro entrada R$5-15k, ciclo 15-30 dias.

REGRAS INVIOLÁVEIS:
1. NUNCA sugerir pausar campanha sem cruzar pipeline ativo Zoho 90d.
2. Campanha com <50 cliques nos últimos 7d ainda não tem dados — NÃO sugerir nada de bidding/pause; só sugerir budget shift se claramente subdimensionada.
3. Bebedouro/Filtros/Refis têm ciclos diferentes — não comparar ROAS entre eles.
4. NUNCA sugerir mexer em campanha brand/institucional por eficiência.
5. Se Enhanced Conv Value estiver OFF, sinalizar antes de qualquer sugestão de tROAS.
6. Output sempre em PT-BR, máximo 3 ações priorizadas, cada uma com expected_impact_brl quantificado.

ENTRADA: você recebe JSON com campaigns_30d, campaigns_today, search_terms_top, keywords_waste, pipeline_por_campanha (Zoho), red_flags do detector de regras, ações já executadas nas últimas 24h (não repita).

SAÍDA: JSON estrito conforme schema. Cada ação tem reasoning em 2-3 linhas + métrica que sustenta.
```

### 4.2 Frequência

- Cron principal: `0 8,12,16,20 * * *` (4x/dia, fora do BRT noturno)
- On-demand: botão "Refresh" no dashboard (rate-limit 1x a cada 15 min/usuário)
- Skip days: domingos e feriados nacionais (campanhas variam, gera ruído)
- Skip se `cron_morning_report` da mesma manhã ainda não rodou (dados stale)

### 4.3 Output Schema

```json
{
  "generated_at": "2026-04-29T08:00:00-03:00",
  "context_window": "last_30_days",
  "actions": [
    {
      "id": "act_2026-04-29_001",
      "tipo": "reduce_budget" | "increase_budget" | "pause_campaign" | "pause_keyword" | "add_negative" | "adjust_tcpa" | "investigate" | "scale_winner",
      "platform": "google" | "meta",
      "target_type": "campaign" | "ad_group" | "keyword" | "search_term",
      "target_id": "23791991961",
      "target_name": "Google Ads · Bebedouro · MAX_CONVERSIONS",
      "current_value": { "budget_brl": 600, "tcpa_brl": null },
      "proposed_value": { "budget_brl": 720, "tcpa_brl": null },
      "reasoning": "ROAS 10,01x últimas 30d, IS perdido por budget 38%. Subir +20% deve capturar ~R$3k extra de receita ao mês.",
      "evidence": {
        "metric": "search_budget_lost_impression_share",
        "value": 0.38,
        "lookback_days": 30
      },
      "expected_impact_brl": 3000,
      "confidence": 0.82,
      "requires_human": false,
      "blocked_reason": null,
      "pipeline_check": { "ativo_brl": 14000, "deals": 7, "threshold": 8000 },
      "execute_endpoint": "POST /trafego/google/campaign/23791991961/budget",
      "execute_body": { "delta_pct": 20 },
      "priority": 1
    }
  ],
  "skipped": [
    { "campaign": "PMax Refis", "reason": "Apenas 18 cliques 7d — dado insuficiente" }
  ]
}
```

**Campos obrigatórios:** `tipo, platform, target_id, reasoning, expected_impact_brl, confidence (0-1), requires_human, priority (1-3)`.

**`requires_human=true` quando:** confidence < 0.7, ou ação é PAUSE, ou pipeline_ativo ≥ 80% do threshold (zona cinzenta), ou orçamento da mudança > R$200/dia delta absoluto.

**`requires_human=false`:** dashboard mostra botão "Aplicar" com 1 clique; se tiver `auto_apply_whitelist` ativado pelo Paulo (config futura), aplica sozinho e loga `source=agent_ia`.

### 4.4 Quando NÃO sugerir

- Campanha com `< 50 cliques` em 7d → skip
- Campanha `< 14 dias de vida` → skip exceto investigate
- Campanha `PAUSED há < 7d` → skip (não ressuscitar)
- Action idêntica já registrada nas últimas 24h em `trafego_actions_log` → skip
- Pipeline_ativo > 2× threshold → nunca sugerir pause/redução agressiva
- Domingo + feriado → skip ciclo
- Token Google Ads / Meta expirado (Railway) → emite alerta em vez de ações

---

## 5. Implementação — ordem sugerida

1. `lib/google-ads.js` + `lib/meta-ads.js` (camada thin sobre MCP/REST)
2. Tabela `trafego_actions_log` no Postgres Railway
3. Endpoints #3 (budget) e #6 (negative kw) — baixo risco, valida pipeline
4. Approval Gate `lib/pipeline-check.js` (reusa `lib/zoho.js`)
5. Endpoints #1, #2, #5, #7 com gate ligado
6. Endpoint #4 (tCPA) — depende de bidding strategy
7. Worker `workers/gestor-trafego.js` lendo cache do dashboard (não duplica chamadas API)
8. UI: dropdown de ação por linha + Red Flag Card + página `/trafego/audit`
9. Botões "Aplicar sugestão" do agente IA → POST nos endpoints existentes com `source=agent_ia`

**Smoke test antes de prod:** rodar todas actions com flag `?dry_run=true` que valida pré-condições + roda pipeline_check + retorna `would_execute: true/false` SEM tocar Google/Meta API.
