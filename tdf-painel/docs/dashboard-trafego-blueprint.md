# Blueprint Executivo — Dashboard de Tráfego TDF

**Versão:** 1.0
**Data:** 2026-04-29
**Owner:** Gestor de Mídia Paga TDF
**Stack:** Node.js + Express + EJS, deploy Railway, repo `paulinhotdf/tdf-portal`
**Investimento sob gestão:** ~R$67-82k/mês (Google R$45-60k + Meta R$22k)

---

## 1. ARQUITETURA DE DADOS

### 1.1 Google Ads — GAQLs e Periodicidade

Todas as queries rodam via MCP `google-ads.run_gaql_query`. Persistir resultado em `data/google_ads/<scope>/<YYYY-MM-DD>.json` para histórico e cache do dashboard.

#### A) Campanhas (cron: `*/30 * * * *` — a cada 30 min)
```sql
SELECT
  campaign.id,
  campaign.name,
  campaign.status,
  campaign.advertising_channel_type,
  campaign.bidding_strategy_type,
  campaign_budget.amount_micros,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.conversions_value,
  metrics.ctr,
  metrics.average_cpc,
  metrics.search_impression_share,
  metrics.search_budget_lost_impression_share,
  metrics.search_rank_lost_impression_share
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.status IN ('ENABLED','PAUSED')
ORDER BY metrics.cost_micros DESC
```
Trazer também a leitura de **TODAY** separada (`segments.date DURING TODAY`) para o card "investimento hoje".

#### B) Ad Groups (cron: `0 */2 * * *` — a cada 2h)
```sql
SELECT
  campaign.id, campaign.name,
  ad_group.id, ad_group.name, ad_group.status,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions, metrics.conversions_value,
  metrics.ctr, metrics.average_cpc
FROM ad_group
WHERE segments.date DURING LAST_30_DAYS
  AND ad_group.status = 'ENABLED'
```

#### C) Keywords (cron: `0 6,14,22 * * *` — 3x ao dia)
```sql
SELECT
  campaign.name, ad_group.name,
  ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  ad_group_criterion.quality_info.quality_score,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions, metrics.conversions_value,
  metrics.ctr, metrics.average_cpc,
  metrics.search_impression_share
FROM keyword_view
WHERE segments.date DURING LAST_30_DAYS
  AND ad_group_criterion.status = 'ENABLED'
  AND metrics.impressions > 0
```

#### D) Search Terms (cron: `0 8 * * *` — 1x ao dia, 06h após leads do dia)
```sql
SELECT
  campaign.name, ad_group.name,
  search_term_view.search_term,
  search_term_view.status,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions
FROM search_term_view
WHERE segments.date DURING LAST_14_DAYS
  AND metrics.clicks >= 2
ORDER BY metrics.cost_micros DESC
```

#### E) Auction Insights (cron: `0 9 * * 1` — 1x semana, segundas)
```sql
SELECT
  campaign.name,
  auction_insight_domain,
  metrics.search_impression_share,
  metrics.search_overlap_rate,
  metrics.search_outranking_share
FROM campaign_audience_view
WHERE segments.date DURING LAST_30_DAYS
```

### 1.2 Meta Ads — Endpoints e Campos

Via MCP `meta-ads`. Cron principal `*/30 * * * *` (espelha Google).

| Endpoint | Nível | Campos | Periodicidade |
|---|---|---|---|
| `/act_<ID>/insights?level=campaign` | Campanha | `campaign_id, campaign_name, spend, impressions, clicks, ctr, cpc, cpm, actions{lead, onsite_conversion.messaging_conversation_started_7d, purchase}, action_values{purchase}, frequency, reach` | 30 min |
| `/act_<ID>/insights?level=adset` | AdSet | + `adset_id, adset_name, optimization_goal, daily_budget, lifetime_budget` | 2h |
| `/act_<ID>/insights?level=ad&breakdowns=age,gender` | Ad | + `ad_id, ad_name, creative_id` | 6h |
| `/<ad_id>?fields=creative{thumbnail_url,body,title,call_to_action_type}` | Creative | thumbnail, copy, CTA | 1x dia |
| `/act_<ID>/insights?breakdowns=publisher_platform,platform_position` | Placement | spend/leads/CPL por placement | 1x dia |
| `/act_<ID>/insights?breakdowns=region` | Geo | spend/leads por estado | 1x dia |

**Atribuição janela:** sempre `action_attribution_windows=['7d_click','1d_view']` (default Meta). Persistir `7d_click` separado para conciliar com Zoho.

### 1.3 Cruzamento Lead Zoho × Clique (sem GCLID/FBCLID confiável)

A atribuição em TDF é **multi-camada com prioridade decrescente**. A cada lead processado, executar em ordem e parar no primeiro match com confiança aceitável.

**Camada 1 — Lead_Source enum direto (confiança alta — 95%)**
- Lead_Source já vem normalizado da automação como `"Google Ads · Bebedouro · MAX_CONVERSIONS"` ou `"Meta Ads · Condomínio · LAL 1%"`.
- Parsear: `[plataforma] · [produto/segmento] · [estratégia/campanha]`.
- Atribuir ao campaign_id correspondente via tabela de mapping `lead_source_to_campaign_id` (manter em `data/attribution/mapping.json`, rebuilt diariamente cruzando nomes).

**Camada 2 — UTMs no Lead (confiança média-alta — 85%)**
- Campos custom Zoho: `UTM_Source`, `UTM_Campaign`, `UTM_Medium`, `UTM_Content`.
- Mapear `utm_source=google` + `utm_campaign=*bebedouro*` → campanha pelo nome (fuzzy match Levenshtein > 0.85).

**Camada 3 — Telefone matching com WATI messageReferral (confiança alta — 90%, só Meta CTWA)**
- Lead chegou via WhatsApp, buscar em WATI `getMessages` o último `messageReferral` do contato em janela de 7d.
- Se `source_type=ad` e `source_id` presente → match direto com `ad_id` Meta.
- Resolve a cegueira de Lead Ads para CTWA (Click-to-WhatsApp).

**Camada 4 — Fingerprint temporal (confiança baixa — 50%)**
- Para Lead Ads Meta sem campaign_id no webhook (5/6 campanhas afetadas):
- Janela: lead criado entre `T` e `T-15min` → atribuir proporcionalmente aos AdSets ativos com gasto > 0 nos últimos 60min, ponderado por `spend × CTR`.
- **Marcar atribuição com flag `attribution_confidence: "low"`** — relatório separa dois totais (alta + média confiança vs total bruto).

**Camada 5 — Bucket "Não Atribuído"**
- Se nenhuma camada bate, lead vai para bucket `unattributed`.
- Reportar % unattributed por dia. Meta: < 15%. Hoje provavelmente está em 30-45%.

#### Regra crítica de antiguidade
Lead com `Created_Time` há mais de 30 dias **NUNCA** é atribuído a campanha do dia. Se o lead "reaparecer" (nova mensagem WATI), o crédito vai para a campanha do contato original (lookup pelo Created_Time do Contact, não do Deal).

### 1.4 Cálculo de CAC Real

**CAC por campanha (janela 30d):**
```
CAC_campanha = SUM(spend_campanha[D-30, D]) / COUNT(deals WHERE Stage='Fechado Ganho' AND Closing_Date IN [D-30, D] AND attribution.campaign_id = campanha.id AND attribution.confidence IN ('high','medium'))
```

**ROAS por campanha:**
```
ROAS_campanha = SUM(deals.Amount WHERE Stage='Fechado Ganho' AND attribution=campanha) / SUM(spend_campanha)
```

**Janelas adicionais (rolling):** 7d, 30d, 90d. Card do dashboard mostra 30d default + sparkline 90d.

**Receita pendente (pipeline):**
```
Pipeline_Value_campanha = SUM(deals.Amount WHERE Stage IN ('Qualificado','Proposta','Em Atendimento') AND attribution=campanha) × probabilidade_média_por_stage
```
Probabilidades calibradas mensalmente: Qualificado 15%, Proposta 35%, Em Atendimento 55% (revisar com dados históricos a cada 60 dias).

**Conversão lead → venda por campanha (janela 60d para dar tempo de fechar):**
```
ConvLeadVenda = COUNT(deals.Fechado Ganho com lead.Created_Time IN [D-60, D-1]) / COUNT(leads.Created_Time IN [D-60, D-1])
```

---

## 2. UX DO DASHBOARD

### 2.1 Topo — 9 Cards

Linha única, responsiva, ordem da esquerda pra direita:

```
+--------------------+--------------------+--------------------+
| INVEST. HOJE       | INVEST. MÊS        | LEADS HOJE         |
| R$ 2.430           | R$ 58.420          | 47                 |
| ▲ 8% vs ontem      | 73% do orçado      | ▼ 12% vs MMD7      |
| (Google R$1.6k     | Restam R$ 21.580   | Google 28 / Meta 19|
|  Meta R$ 830)      | (12 dias) → R$1.8k/d|                    |
+--------------------+--------------------+--------------------+
| CPL HOJE           | CAC 30d            | RECEITA 30d        |
| R$ 51,70           | R$ 387             | R$ 412.580         |
| Meta: R$ 45        | Meta: R$ 350       | ▲ 18% vs 30d ant.  |
| ▲ 15% vs MMD7      | ▲ R$ 32 (9%) MoM   | (Google 67% Meta 33%)|
+--------------------+--------------------+--------------------+
| ROI / ROAS         | TICKET MÉDIO       | CONV. LEAD→VENDA   |
| 5,8x               | R$ 1.840           | 9,2%               |
| Meta: 5,0x         | ▲ R$ 90 vs MMD30   | Meta: 11%          |
| Google 6,7x        | Bebedouro R$ 2.4k  | ▼ 1,3pp vs mês ant.|
| Meta 4,1x          | Filtros R$ 1.1k    | (60d window)       |
+--------------------+--------------------+--------------------+
```

**Comparativos por card (regra única para todos):**
- Métrica intraday → vs mesmo horário ontem (até 23:59 normaliza vs ontem inteiro)
- Métrica diária → vs MMD7 (média móvel 7 dias) e dia anterior
- Métrica 30d → vs 30d anteriores e vs mesmo período mês passado
- Cor: verde se melhor que meta, amarelo se entre meta e -10%, vermelho se -10% abaixo da meta

### 2.2 Visão Profunda Google — Tabela Keywords

**URL:** `/trafego/google/keywords`

Colunas (ordenação default `cost DESC`):
| Coluna | Sortable | Filtro |
|---|---|---|
| Campanha | sim | dropdown multi |
| Ad Group | sim | dropdown |
| Keyword | sim | search text |
| Match Type | sim | chip filter (Exact/Phrase/Broad) |
| QS | sim | range (1-10) |
| Impressions | sim | min |
| Clicks | sim | min |
| CTR | sim | range |
| CPC médio | sim | range |
| Custo 30d | sim | min |
| Conv (Google) | sim | - |
| Leads (CRM) | sim | - |
| Vendas (CRM) | sim | - |
| **CAC keyword** | sim | range |
| **ROAS** | sim | range |
| Status | - | Enabled/Paused/All |

**Filtros principais (sidebar):**
- Período: 7d / 30d / 90d / custom
- Campanha (multi)
- Match type
- QS range
- Apenas com gasto > R$ X
- "Sem retorno" (toggle: keywords com cost > R$200 e zero leads/vendas)

**Linhas em vermelho:** keyword com `cost_30d > R$ 300 AND conversions = 0`. Linha verde sombreada: ROAS > 8x e impressions > 500.

### 2.3 Visão Profunda Meta — Galeria Criativos

**URL:** `/trafego/meta/criativos`

Layout grid (3 colunas em desktop), card por criativo:
```
+----------------------------------+
| [thumbnail 16:9]                 |
| Campanha: Condomínio LAL 1%      |
| Adset: 25-55 SP cap              |
| Status: ATIVO  Frequência: 2,3   |
|                                  |
| Spend 30d: R$ 4.820              |
| Impr: 218k   CTR: 1,42%          |
| CPL: R$ 38   Leads: 127          |
| CAC: R$ 412  Vendas (CRM): 11    |
| ROAS: 3,8x   Receita: R$ 18.3k   |
|                                  |
| [Ver copy] [Pausar] [Duplicar]   |
+----------------------------------+
```

**Filtros sidebar:**
- Período
- Campanha (multi)
- Status
- Frequency >= X (alerta de fadiga)
- CTR < X
- Apenas com leads (toggle)
- Idade do criativo (`< 7d`, `7-30d`, `> 30d`)

**Ordenação default:** `spend DESC` (criativos que mais consomem orçamento aparecem primeiro).

### 2.4 Funil Completo

**URL:** `/trafego/funil` (tabs: All / Google / Meta / por campanha)

```
Cliques        Leads           Contato        Qualificado    Proposta     Venda
12.450 ───►   542 ───►         489 ───►        287 ───►       142 ───►    96
              (4,3%)           (90,2%)         (58,7%)        (49,5%)     (67,6%)

  Cliques→Leads     Leads→Contato     Contato→Qualif    Qualif→Prop     Prop→Venda
   4,3%              90,2%             58,7%             49,5%           67,6%
   Meta: 6%          Meta: 95%         Meta: 65%         Meta: 55%       Meta: 70%
   ▼ 1,7pp           ▼ 4,8pp           ▼ 6,3pp           ▼ 5,5pp         ▼ 2,4pp
```

Etapas mapeadas no Zoho:
- Cliques: soma de Google + Meta
- Leads: `Created_Time` em janela
- Contato: Stage NOT IN ('Leads Novos', 'IA sem Contato')
- Qualificado: Stage='Qualificado' OU já passou por Qualificado
- Proposta: Stage='Proposta' OU já passou
- Venda: Stage='Fechado Ganho'

**Toggle "Time" (Bebedouro / Purificador / Filtro Entrada):** filtra pelo Layout/Pipeline do deal. Cada time tem seu funil separado.

---

## 3. RED FLAGS + ALERTAS AUTOMÁTICOS

### 3.1 Tabela de Thresholds

| # | Alerta | Threshold quantitativo | Janela | Severidade | Canal |
|---|---|---|---|---|---|
| 1 | **CAC subindo** | CAC 7d > CAC 30d × 1,20 (20% acima) E volume vendas 7d ≥ 5 | rolling 7d vs 30d | MÉDIA | Cliq gestor |
| 2 | **CAC explodindo** | CAC 7d > CAC 30d × 1,50 (50% acima) E vendas 7d ≥ 3 | rolling 7d vs 30d | ALTA | Cliq gestor + Z-API Paulo + banner vermelho |
| 3 | **CPL subindo** | CPL 3d > CPL 14d × 1,25 E spend 3d > R$ 800 | rolling 3d vs 14d | MÉDIA | Cliq gestor |
| 4 | **CPL explodindo** | CPL 3d > CPL 14d × 1,60 E spend 3d > R$ 1.500 | rolling 3d vs 14d | ALTA | Cliq + Z-API + banner |
| 5 | **Queda de conversão lead→venda** | ConvLeadVenda 14d < ConvLeadVenda 60d × 0,75 (-25%) E leads 14d ≥ 50 | rolling | MÉDIA | Cliq gestor |
| 6 | **Conversão crítica** | ConvLeadVenda 14d < ConvLeadVenda 60d × 0,55 (-45%) E leads 14d ≥ 50 | rolling | ALTA | Cliq + Z-API |
| 7 | **Campanha gastando sem venda** | Spend 14d > R$ 2.000 E vendas 14d = 0 E leads 14d < 5 E hist. 90d < 1 venda/R$ gasto | rolling 14d + check 90d | ALTA | Cliq gestor (NUNCA pause automático) |
| 8 | **Campanha drenando orçamento** | Spend 7d > R$ 4.000 E ROAS 7d < 1,5x E ROAS hist. 90d < 2,5x | rolling | CRÍTICA | Cliq + Z-API + banner |
| 9 | **Criativo CTR baixo** | CTR < 0,8% E impressions ≥ 5.000 E ad_age ≥ 5 dias | rolling 7d | BAIXA | Cliq gestor |
| 10 | **Criativo fadigado** | Frequency ≥ 3,5 E CTR caiu > 30% vs primeira semana | rolling | MÉDIA | Cliq gestor |
| 11 | **Keyword sem retorno** | cost 30d > R$ 300 E conversions = 0 E impressions ≥ 200 | 30d | MÉDIA | Cliq gestor (sugerir negative, NUNCA auto-pause) |
| 12 | **Keyword drenando** | cost 30d > R$ 800 E conversions = 0 | 30d | ALTA | Cliq + banner |
| 13 | **Lead sem atendimento** | lead Stage='Leads Novos' AND age > 30 min EM HORÁRIO COMERCIAL | tempo real | ALTA | Cliq vendedor + Cliq gestor |
| 14 | **Lead Diamante/Ouro parado** | score ≥ Ouro AND último update > 2h AND Stage NOT IN ('Proposta','Fechado Ganho','Fechado Perdido') | tempo real | CRÍTICA | Cliq closer + Núbia outreach + Z-API Paulo |
| 15 | **Tempo resposta humano alto** | mediana_resposta_humana_24h > 25 min em horário comercial | rolling 24h | MÉDIA | Cliq gestor + Cliq vendedor responsável |
| 16 | **Tempo resposta crítico** | mediana_resposta_humana_24h > 60 min OU lead premium aguardando > 45 min | rolling 24h | ALTA | Cliq + Z-API |
| 17 | **Budget pacing baixo** | gasto_acumulado_mês < expected_mtd × 0,80 E faltam > 5 dias | diário 09h | MÉDIA | Cliq gestor |
| 18 | **Budget pacing alto** | gasto_acumulado_mês > expected_mtd × 1,15 E faltam > 5 dias | diário 09h | ALTA | Cliq + Z-API |
| 19 | **Impression Share Lost (Budget)** | search_budget_lost_impression_share > 25% E ROAS campanha > 4x | diário | MÉDIA | Cliq gestor (sugerir aumento budget) |
| 20 | **Atribuição cega elevada** | unattributed_share_30d > 25% | diário | MÉDIA | Cliq gestor |
| 21 | **Token MCP/CAPI prestes a expirar** | dias_para_expirar_token < 7 | diário 09h | ALTA | Cliq + Z-API Paulo |
| 22 | **Enhanced Conv Value OFF** | enhanced_conversions_value_status != 'ENABLED' | diário | INFO | Banner amarelo persistente até resolver |

### 3.2 Roteamento por Severidade

- **INFO**: banner amarelo dashboard, sem notificação ativa
- **BAIXA**: notificação Cliq do gestor (1x dia, agrupado em digest 09h)
- **MÉDIA**: Cliq gestor imediato (rate limit 1 alerta/canal/30min)
- **ALTA**: Cliq gestor + banner vermelho dashboard + entrada na fila de aprovação
- **CRÍTICA**: Cliq + Z-API Paulo + banner vermelho + auto-criar Tarefa no Zoho atribuída ao gestor

### 3.3 Anti-spam e dedup
- Mesmo alerta na mesma entidade (campanha/keyword/criativo) só dispara 1x a cada 6h, salvo escalada de severidade.
- Digest matinal 07h05 (depois do morning report): consolidado de todos os alertas de baixa severidade do dia anterior.

---

## 4. SYSTEM PROMPT — GESTOR IA

```
Você é o GESTOR DE MÍDIA PAGA IA da Tudo de Filtro (TDF), empresa brasileira de filtros de água e bebedouros (B2C+B2B).
Sua missão: analisar dados de Google Ads, Meta Ads e Zoho CRM em tempo real e gerar 3 a 5 recomendações priorizadas por IMPACTO FINANCEIRO em reais.

## PERSONA
- Senior PPC strategist, 10 anos de experiência em e-commerce + lead gen B2C/B2B no Brasil.
- Linguagem direta, sem jargão de agência. Cada recomendação tem um número.
- Trabalha PARA o Paulo (dono). Reporta a verdade mesmo quando ruim.

## DADOS DE ENTRADA (JSON SCHEMA)
{
  "snapshot_date": "2026-04-29T14:00:00-03:00",
  "account": {
    "monthly_target_cac_brl": 350,
    "monthly_target_roas": 5.0,
    "monthly_budget_google_brl": 55000,
    "monthly_budget_meta_brl": 22000
  },
  "google": {
    "campaigns": [{
      "id": "23791991961",
      "name": "Bebedouros · Vale Paraíba · MAX_CONVERSIONS",
      "status": "ENABLED",
      "bid_strategy": "MAXIMIZE_CONVERSIONS",
      "daily_budget_brl": 200,
      "spend_today_brl": 187,
      "spend_7d_brl": 1310,
      "spend_30d_brl": 5840,
      "clicks_30d": 412,
      "leads_attributed_30d_high_conf": 38,
      "deals_won_30d": 6,
      "revenue_won_30d_brl": 14400,
      "cac_30d_brl": 973,
      "roas_30d": 2.46,
      "search_impression_share": 0.42,
      "search_budget_lost_is": 0.31,
      "ctr_30d": 0.043,
      "history_90d": {"spend":18200,"deals":21,"revenue":48300,"roas_90d":2.65}
    }],
    "keywords_underperforming": [{"campaign":"...", "keyword":"...", "match":"BROAD", "spend_30d":420, "clicks":58, "conv":0, "qs":4}],
    "search_terms_wasted": [{"term":"...", "spend_30d":180, "clicks":22, "conv":0}]
  },
  "meta": {
    "campaigns": [{...}],
    "creatives": [{
      "ad_id":"...","name":"...","spend_30d":4820,"impressions":218000,
      "ctr":0.0142,"frequency":2.3,"leads_attributed_30d":127,
      "leads_unattributed_estimate":40,"deals_won":11,"revenue":18300,
      "creative_age_days":47,"format":"video","attribution_confidence":"medium"
    }]
  },
  "crm": {
    "deals_won_30d": 96,
    "avg_ticket_brl": 1840,
    "lead_to_won_conv_60d": 0.092,
    "active_pipeline_value_brl": 142000,
    "deals_in_proposta_by_campaign": {"23791991961": 4}
  },
  "alerts_active": [...]
}

## REGRAS DE ANÁLISE

1. **PRIORIZE IMPACTO FINANCEIRO**, não vaidade. Recomendação que economiza R$ 8.000/mês > recomendação que melhora CTR de 1,2% pra 1,4%.

2. **STATISTICAL SIGNIFICANCE MÍNIMA antes de qualquer ação destrutiva:**
   - Pause keyword: mínimo 200 cliques OU R$ 300 gastos sem conversão.
   - Pause criativo: mínimo 5.000 impressions E 7 dias de vida E CTR < 0,7%.
   - Pause campanha: PROIBIDO via recomendação automática (ver regra 6).
   - Reduzir budget: mínimo 14 dias de dados E ROAS 14d < 50% da meta.
   - Aumentar budget: mínimo 14 dias E ROAS 14d > 130% da meta E impression_share_lost_budget > 20%.

3. **CONFIANÇA DA RECOMENDAÇÃO** (campo `confidence`):
   - "high": >= 30 dias de dados, atribuição alta/média, sample suficiente
   - "medium": 14-30 dias OU atribuição parcialmente cega
   - "low": < 14 dias OU > 40% atribuição low_confidence
   Recomendações `low` só vão como "investigar", nunca como "executar".

4. **NUNCA pausar campanha sem cruzar histórico CRM 90d + pipeline ativo.** Esta é regra inviolável. Antes de sugerir QUALQUER pause, verificar:
   - `history_90d.deals` >= 1?
   - `crm.deals_in_proposta_by_campaign[campaign_id]` >= 1?
   Se SIM em qualquer um → recomendação é "investigar/reduzir budget 30%", NUNCA "pausar".
   (Razão histórica: o dono já pausou campanha que tinha negócios em andamento e perdeu deals. Não repetir.)

5. **LEAD ANTIGO (>30 DIAS) NÃO CONTA PARA ATRIBUIÇÃO RECENTE.** Ao calcular CAC/ROAS de campanha do dia/semana, ignorar deals cujo Contact.Created_Time é anterior à campanha + janela.

6. **META LEAD ADS TEM ATRIBUIÇÃO CEGA (5/6 campanhas).** Quando avaliar Meta:
   - Sempre reportar 2 números: `attributed_high_med` e `total_inferred`.
   - Se `unattributed_share > 30%`, marcar recomendação Meta como `confidence: medium` no máximo.
   - NUNCA pausar AdSet Meta baseado em CAC se atribuição < 70%. Sugerir "validar via experimento geo split".

7. **ENHANCED CONVERSIONS VALUE ESTÁ OFF NO GOOGLE.** Considerar que tROAS pode estar subnotificado. Ao recomendar bid strategy, mencionar "ativar Enhanced Conv Value antes de migrar para tROAS".

8. **CATEGORIAS DE AÇÃO PERMITIDAS:**
   - `scale_budget`: aumentar orçamento (até +30% por iteração, semanal)
   - `reduce_budget`: reduzir orçamento (até -30% por iteração, semanal)
   - `add_negative_keyword`: adicionar negativa
   - `pause_keyword`: pausar palavra-chave (com gates da regra 2)
   - `pause_creative`: pausar criativo (com gates da regra 2)
   - `change_bid_strategy`: trocar estratégia de lance
   - `restructure`: sugerir reestruturação (com plano de migração)
   - `investigate`: solicitar análise humana (sem ação automática)
   - `experiment`: propor teste A/B, geo split, holdout
   - `fix_tracking`: corrigir setup (Enhanced Conv, CAPI, UTM)

9. **CADA RECOMENDAÇÃO TEM `expected_impact_brl_monthly`** calculado:
   - scale_budget: `(roas_atual - 1) × delta_budget_mensal`
   - reduce_budget: `delta_budget_mensal × (1 - roas_atual/roas_meta)` se roas < meta, senão `0`
   - pause_keyword/creative: `spend_mensal_estimado × (1 - conv_rate_relativa)`
   - fix_tracking: estimativa conservadora baseada em ganho típico (5-15% lift), marcar como "estimado"

10. **EM CASO DE CONFLITO ENTRE MÉTRICAS**: priorize CRM (Fechado Ganho real) sobre conversões da plataforma. Plataforma mente, CRM não.

## FORMATO DE SAÍDA (JSON ESTRITO)

{
  "generated_at": "ISO8601",
  "summary": "1 frase de até 200 chars resumindo a saúde da conta hoje",
  "top_risk": "1 frase com o maior risco financeiro identificado",
  "recommendations": [
    {
      "rank": 1,
      "action": "reduce_budget",
      "target": {
        "platform": "google",
        "entity_type": "campaign",
        "entity_id": "23791991961",
        "entity_name": "Bebedouros · Vale Paraíba · MAX_CONVERSIONS"
      },
      "rationale": "ROAS 30d 2,46x vs meta 5,0x, CAC R$973 (2,8× meta), 6 deals em 30d e 4 em pipeline ativo - portanto reduzir 30% ao invés de pausar. Histórico 90d ROAS 2,65x indica problema estrutural, não sazonal.",
      "evidence": {
        "spend_30d_brl": 5840,
        "roas_30d": 2.46,
        "deals_won_30d": 6,
        "deals_in_pipeline": 4,
        "history_90d_roas": 2.65
      },
      "proposed_change": {"daily_budget_brl_from": 200, "daily_budget_brl_to": 140},
      "expected_impact_brl_monthly": 1080,
      "confidence": "high",
      "requires_human_approval": true,
      "rollback_plan": "Se leads 7d cair > 40% após mudança, restaurar budget original."
    }
  ],
  "deferred": [
    {"reason":"...","what_we_need":"..."}
  ],
  "data_quality_warnings": [
    "Atribuição Meta com 34% unattributed - confiança limitada nas recomendações Meta",
    "Enhanced Conversions Value OFF no Google - ROAS pode estar subestimado em 8-15%"
  ]
}

## REGRAS DE ESCRITA
- `rationale` SEMPRE cita números (R$, %, dias).
- `rationale` SEMPRE menciona o pipeline ativo se action for destrutiva.
- Nunca use "talvez", "pode ser", "considere". Use "recomendo", "evidência mostra", "ação: X".
- Em português brasileiro. Decimais com vírgula em texto, ponto em JSON numérico.
- Máximo 5 recomendações. Se houver mais oportunidades, listar em `deferred`.

## GUARDRAILS FINAIS
- Se receber dados com `attribution_confidence: low` predominante (>50% dos leads), responder com `recommendations: []` e popular `data_quality_warnings` + `deferred` exigindo correção do tracking primeiro.
- Se algum cron de dados está atrasado > 4h (timestamp mais recente vs `snapshot_date`), marcar warning e reduzir tudo para `confidence: medium` no máximo.
- Toda recomendação `pause_*` ou `reduce_budget > 25%` exige `requires_human_approval: true`.
```

---

## Apêndice A — Estrutura de Pastas Sugerida

```
tdf-portal/
  docs/
    dashboard-trafego-blueprint.md       (este doc)
  data/
    google_ads/
      campaigns/YYYY-MM-DD.json
      ad_groups/YYYY-MM-DD.json
      keywords/YYYY-MM-DD.json
      search_terms/YYYY-MM-DD.json
    meta_ads/
      campaigns/YYYY-MM-DD.json
      adsets/YYYY-MM-DD.json
      creatives/YYYY-MM-DD.json
    attribution/
      mapping.json                       (lead_source → campaign_id)
      unattributed_log/YYYY-MM-DD.json
    cac_history/YYYY-MM.json
  scripts/
    cron/
      pull_google_campaigns.js           (*/30 * * * *)
      pull_google_keywords.js            (0 6,14,22 * * *)
      pull_google_search_terms.js        (0 8 * * *)
      pull_meta_insights.js              (*/30 * * * *)
      compute_attribution.js             (5,35 * * * *)
      compute_cac_roas.js                (10,40 * * * *)
      run_alerts.js                      (15,45 * * * *)
      digest_morning.js                  (5 7 * * *)
    ai/
      gestor_ia.js                       (chama Claude com system prompt acima)
  views/trafego/
    dashboard.ejs
    google/keywords.ejs
    meta/criativos.ejs
    funil.ejs
```

## Apêndice B — Stack de Cron Recomendado

Usar `node-cron` no próprio Express server (já roda 24/7 no Railway). Cada job grava `data/_health/<job>.json` com `last_run_at` e `last_status`. Endpoint `/admin/health/crons` mostra heartbeat — se algum job atrasou > 2× sua periodicidade, dispara alerta #21 equivalente.

## Apêndice C — Roadmap de Implementação (24-72h)

| Hora | Entregável |
|---|---|
| H+0 a H+8 | Crons Google + Meta puxando dados, persistindo JSON |
| H+8 a H+16 | Engine de atribuição (5 camadas) + cálculo CAC/ROAS |
| H+16 a H+24 | Dashboard topo (9 cards) + funil |
| H+24 a H+40 | Tabela keywords + galeria criativos |
| H+40 a H+56 | Engine de alertas (22 thresholds) + roteamento Cliq/Z-API |
| H+56 a H+72 | Gestor IA endpoint `/api/gestor-ia/analyze` retornando JSON estruturado, banner de recomendações no topo do dashboard |

---

**Fim do blueprint.** Próximo passo: começar pelos crons da Seção 1.1 e 1.2 — sem dados consolidados, nada acima funciona.
