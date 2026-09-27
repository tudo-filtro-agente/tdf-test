# Dashboard Tráfego TDF — KPIs v1 (spec de implementação)

**Versão:** 1.0
**Data:** 2026-04-29
**Owner:** Auditor de Mídia Paga TDF
**Escopo:** monitoramento (não estratégia, não atribuição-fix). Consumível por agente de código.

---

## 1. TOPO — 9 CARDS

Ordem fixa, esquerda→direita, top→bottom. Cada card tem `valor_principal`, `comparativo`, `breakdown_secundario`. Cor: verde > meta, amarelo entre meta e -10%, vermelho ≤ -10% meta.

| # | Card | Fórmula exata | Comparativo | Breakdown |
|---|------|---------------|-------------|-----------|
| 1 | Investimento hoje | `SUM(spend WHERE date=TODAY)` Google+Meta | vs ontem mesmo horário (intraday) | Google R$ / Meta R$ |
| 2 | Investimento mês | `SUM(spend WHERE date BETWEEN MTD)` | % do `monthly_budget_total`; pacing diário restante = `(budget-gasto)/dias_restantes` | vs mesmo dia mês passado |
| 3 | Leads hoje | `COUNT(Lead.Created_Time=TODAY)` Zoho | vs MMD7 e vs ontem | Google / Meta / Orgânico |
| 4 | CPL hoje | `spend_today / leads_today` (atribuídos high+medium) | vs MMD7; meta TDF: R$ 45 | Google CPL / Meta CPL |
| 5 | CAC 30d | `SUM(spend_30d) / COUNT(deals.Fechado_Ganho 30d com atribuição high+medium)` | vs 30d anteriores; meta: R$ 350 | Bebedouro / Filtro Entrada / Refil |
| 6 | Receita 30d | `SUM(deals.Amount WHERE Stage='Fechado Ganho' AND Closing_Date 30d)` | vs 30d anteriores; vs mesmo período mês passado | Google % / Meta % |
| 7 | ROAS 30d | `receita_30d / spend_30d` | vs 30d anteriores; meta: 5,0x | Google ROAS / Meta ROAS |
| 8 | Ticket médio 30d | `receita_30d / deals_won_30d` | vs MMD30 anterior | Bebedouro / Filtro / Refil |
| 9 | Conv. lead→venda 60d | `deals_won_60d / leads_created_60d` | vs 60d anteriores; meta: 11% | por time (Bebedouro/Purificador/Filtro Entrada) |

**Regra dos comparativos** (única para todos):
- Métrica intraday → vs mesmo horário ontem
- Métrica diária → vs MMD7 + vs D-1
- Métrica 30d → vs 30d anteriores + vs mesmo período mês passado

---

## 2. TABELA GOOGLE — KEYWORDS (`/trafego/google/keywords`)

### Colunas obrigatórias (v1)
```
campaign_name      : string  : nome curto (truncar 40 chars)
ad_group_name      : string  : truncar 30 chars
keyword_text       : string  : termo
match_type         : enum    : EXACT|PHRASE|BROAD
quality_score      : int 1-10: null se < 30 impressions
clicks_30d         : int     :
cost_30d_brl       : float   : R$ 2 casas
ctr_30d            : float   : %
avg_cpc_brl        : float   :
leads_crm_30d      : int     : leads atribuídos via mapping (high+medium)
deals_won_30d      : int     : deals Fechado Ganho atribuídos
revenue_30d_brl    : float   :
cac_keyword_brl    : float   : cost_30d / deals_won_30d (null se 0 vendas)
roas_keyword       : float   : revenue_30d / cost_30d
status             : enum    : ENABLED|PAUSED
```

### Secundárias (mostrar com toggle "colunas avançadas")
```
impressions_30d         : int
search_impression_share : float : %
top_of_page_rate        : float : %
conv_google_30d         : int   : conversion count da plataforma (pra cruzar com CRM)
```

### Bonus (v1.5)
```
trend_7d_vs_30d_cost    : float : delta % gasto
delta_cac_vs_account    : float : cac_kw / cac_conta - 1
search_term_overlap_top : array : top 3 search terms que disparam essa kw
```

### Highlights de linha
- Vermelho: `cost_30d > 300 AND deals_won_30d = 0`
- Verde sombreado: `roas_keyword > 8 AND impressions_30d > 500`
- Cinza: `status = PAUSED`

---

## 3. TABELA META — CRIATIVOS (`/trafego/meta/criativos`) — grid 3 cols

### Colunas obrigatórias (v1)
```
ad_id              : string
ad_name            : string : truncar 50
campaign_name      : string
adset_name         : string
thumbnail_url      : string : 16:9
status             : enum   : ACTIVE|PAUSED
creative_age_days  : int    : days since created
spend_30d_brl      : float
impressions_30d    : int
ctr_30d            : float : %
cpl_30d_brl        : float : spend_30d / leads_attributed_30d
leads_attributed_30d   : int : high+medium confidence
leads_unattributed_est : int : low confidence (mostrar separado)
deals_won_30d_crm  : int
revenue_30d_brl    : float
cac_creative_brl   : float
roas_creative      : float
frequency_30d      : float : alerta visual >= 3.5
attribution_conf   : enum  : high|medium|low (badge cinza/amarelo/vermelho)
```

### Secundárias
```
cpm_30d_brl        : float
reach_30d          : int
format             : enum   : video|image|carousel
placement_top      : string : melhor placement por leads (feed/stories/reels)
age_gender_top     : string : faixa que mais converte
```

### Bonus
```
ctr_first_7d_vs_now    : float : delta % CTR (detector de fadiga)
copy_excerpt           : string : primeiros 80 chars do body
cta_type               : string
```

### Highlights
- Borda vermelha: `frequency >= 3.5 OR (ctr < 0.008 AND impressions >= 5000 AND age >= 5d)`
- Borda verde: `roas_creative > 4 AND attribution_conf != low`
- Badge "ATRIBUIÇÃO CEGA" quando `attribution_conf=low` ou campanha é Lead Ads

---

## 4. FUNIL (`/trafego/funil`) — tabs All/Google/Meta/por campanha

### Etapas (em ordem)
```
1. cliques        : SUM(google.clicks + meta.clicks) na janela
2. leads          : COUNT(Lead.Created_Time na janela)
3. contato        : COUNT leads onde Stage NOT IN ('Leads Novos','IA sem Contato')
4. qualificado    : COUNT leads onde Stage='Qualificado' OR já passou
5. proposta       : COUNT deals Stage='Proposta' OR já passou
6. venda          : COUNT deals Stage='Fechado Ganho'
```

### Entre etapas mostrar
```
taxa_conversao   : float % entre N e N+1
meta_taxa        : float % (cliques→leads 6%, leads→contato 95%, contato→qualif 65%, qualif→prop 55%, prop→venda 70%)
delta_pp         : float pontos percentuais vs meta
tempo_medio      : duration mediana entre etapas (em horas/dias)
volume_perdido   : int N - N+1 (leakage absoluto)
```

### Toggles
- Time: All / Bebedouro / Purificador / Filtro Entrada (filtra pipeline Zoho)
- Plataforma: All / Google / Meta
- Período: 7d / 30d / 60d / 90d
- Região: All / Vale Paraíba / Grande SP / Outras

---

## 5. MÉTRICAS ESPECÍFICAS DE CICLO TDF (15-30d, ticket R$ 2k-15k)

Diferente de SaaS B2B. Adicionar como cards secundários ou aba "TDF metrics":

```
ciclo_medio_lead_to_won_dias       : mediana dias entre Lead.Created_Time e Deal.Closing_Date
pct_deals_fechados_em_7d           : % deals que fecham em <=7d (bebedouro deve ser >50%)
pct_deals_fechados_em_30d          : % cumulativo
pct_deals_fechados_em_60d          : % cumulativo (filtro entrada concentra aqui)
ticket_medio_por_produto           : Bebedouro / Filtro Entrada / Refil / Purificador
revenue_por_lead_60d               : revenue_60d / leads_60d (mais robusto que CAC pra ciclo longo)
pipeline_velocity_brl_dia          : (deals_em_negociacao × ticket_medio × win_rate) / ciclo_medio
deals_estagnados_15d               : COUNT deals sem update há > 15d em Stage NOT IN final
recompra_60_180d                   : COUNT contatos com 2+ deals Fechado Ganho na janela (refil é recompra)
```

---

## 6. COMPARATIVOS CRÍTICOS TDF (segmentações obrigatórias)

### A) CAC/ROAS por produto (bebedouro vs filtro entrada vs refil)
Card lado-a-lado em `/trafego/comparativos`:
```
produto            : Bebedouro | Filtro Entrada | Refil | Purificador
ciclo_medio_dias   :
ticket_medio_brl   :
spend_30d_brl      :
leads_30d          :
cpl_30d_brl        :
deals_won_30d      :
cac_30d_brl        :
roas_30d           :
delta_vs_meta_pp   : % vs meta CAC/ROAS específica do produto
```
Bebedouro com CAC > R$ 250 e Filtro Entrada com CAC > R$ 600 acendem alerta.

### B) ROAS por região
```
regiao             : Vale Paraíba (base) | Grande SP (expansão) | Litoral Norte | Outras
spend_30d_brl      :
leads_30d          :
deals_won_30d      :
cac_30d_brl        :
roas_30d           :
share_invest_pct   : % do total mensal
```
Vale Paraíba é benchmark. Grande SP tolera CAC 30% maior nos primeiros 60d (flag `regiao_em_expansao=true`).

### C) Lead Ads vs Conversion Ads (Meta)
```
campanha_tipo            : LEAD_AD_NATIVO | CONVERSION_SITE | CTWA
spend_30d_brl            :
leads_total              : (todos os buckets)
leads_attributed_high    :
leads_attributed_medium  :
leads_unattributed       :
unattributed_share_pct   : % cego
deals_won_inferred       : deals atribuídos por todas as camadas
cac_high_med_only_brl    : conservador (só atribuição confiável)
cac_total_inferred_brl   : otimista (todas as camadas)
```
Mostrar SEMPRE os dois CACs. Lead Ads nativo terá unattributed > 30%; sinalizar com badge.

---

## 7. ALERTAS — TOP 3 PARA v1 (codar primeiro, 19 ficam pra v2)

Critérios de seleção: maior impacto financeiro × menor esforço × cobre maior área da operação.

### #8 — Campanha drenando orçamento (CRÍTICA)
```
trigger     : spend_7d > 4000 AND roas_7d < 1.5 AND roas_hist_90d < 2.5
janela      : rolling 7d + check 90d
canais      : Cliq gestor + Z-API Paulo + banner vermelho dashboard
gates       : NUNCA auto-pause; sempre humano
por que v1  : maior risco financeiro mensal (R$ 16k+/mês potencial); cobre Google e Meta;
              fórmula reutilizada por #7 e #11
```

### #2 — CAC explodindo (ALTA)
```
trigger     : cac_7d > cac_30d × 1.50 AND deals_won_7d >= 3
janela      : rolling 7d vs 30d
canais      : Cliq gestor + Z-API + banner
gates       : exige mínimo 3 vendas pra evitar ruído estatístico
por que v1  : KPI #1 da operação; todo o resto deriva. Detecta degradação antes
              do mês fechar no vermelho
```

### #14 — Lead Diamante/Ouro parado (CRÍTICA)
```
trigger     : score >= Ouro AND last_update > 2h AND Stage NOT IN
              ('Proposta','Fechado Ganho','Fechado Perdido')
janela      : tempo real (poll a cada 15min em horário comercial)
canais      : Cliq closer + Núbia outreach + Z-API Paulo
gates       : só horário comercial (Cátia 8-17, Larissa/Fabiana 9-18)
por que v1  : único alerta operacional do top 3 (não é mídia, é receita parada);
              ROI imediato — cada lead Diamante recuperado paga o dashboard inteiro
```

**v2 backlog** (ordem sugerida): #7, #11, #16, #4, #5, #18, #20, #21, #22, #19, #1, #3, #6, #9, #10, #12, #13, #15, #17.

---

## 8. NOTAS DE IMPLEMENTAÇÃO

- Todas as métricas com janela respeitam regra de antiguidade: `Lead.Created_Time > 30d` nunca atribui a campanha do dia
- CAC sempre calcula 2 versões (`high+medium` confiança e `total_inferred`); UI mostra a conservadora por padrão com tooltip da otimista
- Cards 5/7/9 (CAC, ROAS, Conv lead→venda) usam SEMPRE `attribution.confidence IN ('high','medium')` no denominador
- Badge persistente "Enhanced Conv Value OFF" no header até resolver (#22, INFO)
- Cron de health check: `/admin/health/crons` — se job > 2× periodicidade, marca card como stale (cinza + tooltip "dados desatualizados há Xh")

**Fim spec v1.** Pronto pra Edit/Write em código.
