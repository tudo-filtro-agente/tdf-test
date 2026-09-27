# Dashboard de Tráfego — Tracking Health & Atribuição Meta

**Versão:** 1.0 · **Data:** 2026-04-29 · **Owner:** Tracking Specialist
**Pixel Meta:** 1622478091600715 · **CAPI server:** zoho-meta-capi (Railway)

---

## 1. Health Check (seção fixa do dashboard)

Endpoint: `GET /trafego/health` (cache 5min em `data/tracking_health.json`).

Cada check retorna `{id, label, status: 'green'|'yellow'|'red', value, hint}`. Score = média ponderada (verde=100, amarelo=60, vermelho=0).

| Check | Como mede | Verde | Amarelo | Vermelho |
|---|---|---|---|---|
| `meta_capi_last_event` | Meta Graph API `GET /act_<id>/server-events?fields=last_received_event_time` | <2h | 2-24h | >24h ou erro |
| `meta_pixel_browser` | Mesma query, agrega `events_received_count` por source=browser últimas 24h | >100 | 1-100 | 0 |
| `meta_capi_dedup` | `event_match_quality` médio últimos 7d via Graph API | ≥7.0 | 5-7 | <5 |
| `gads_conv_action_active` | MCP `google-ads.run_gaql_query` em `conversion_action WHERE status=ENABLED` | ≥1 primária ativa | só secundárias | 0 |
| `gads_enhanced_value` | Flag manual em `data/tracking_flags.json` (`enhanced_conv_value: false`) | true | — | false (warning persistente) |
| `zoho_token_age` | Idade do refresh token Railway env | <30d | 30-55d | >55d |
| `lead_source_coverage` | `% leads do mês com Lead_Source preenchido` (Zoho search Stage:not_equals:Closed_Lost últimos 30d) | ≥90% | 70-89% | <70% |
| `meta_campaign_id_capture` | `% leads Lead_Source~"Meta" com tag tracking_reconciliado OU campo Campaign_ID` | ≥60% | 30-59% | <30% (ESPERADO HOJE) |
| `wati_referral_capture` | `% mensagens WATI últimos 7d com referral.sourceUrl` no inbox | ≥40% | 20-39% | <20% |

Implementação: novo `lib/tracking-health.js` exportando `runChecks()` que chama Meta Graph + Zoho + lê flags. `server.js` adiciona rota `/trafego/health` e SSE push em mudança de status.

---

## 2. Fix de Atribuição Meta Lead Ads (camadas de confiança)

### 2.1 Captura no `/webhooks/wati` (extender o existente, ~50 linhas)

Quando WATI traz `body.referral`, extrair em `lib/meta-attrib.js`:

```js
function parseReferral(referral = {}) {
  const url = referral.sourceUrl || '';
  const u = (() => { try { return new URL(url); } catch { return null; } })();
  return {
    fbclid: u?.searchParams.get('fbclid') || null,
    utm_source: u?.searchParams.get('utm_source') || null,
    utm_campaign: u?.searchParams.get('utm_campaign') || null,
    utm_content: u?.searchParams.get('utm_content') || null,  // ad_name
    ad_id: referral.headerText?.match(/ad:(\d+)/)?.[1] || null,
    ctwa_clid: referral.ctwaClid || null,  // CTWA específico
    sourceId: referral.sourceId || null,
    timestamp: Date.now(),
  };
}
```

Salvar em `data/meta-attrib/<phone>.json` (TTL 30d). Ao criar deal, carimbar `Lead_Source` com formato:
`"Meta · LeadAd · {utm_campaign||sourceId} · {utm_content||ad_id||'ad?'}"` — substitui o atual `"WhatsApp · CTWA"` quando há referral parseável.

### 2.2 Algoritmo em camadas

Em `lib/meta-attrib.js → attributeLead(deal, referral, recentClicks)`:

| Camada | Sinal | Confiança | Lead_Source |
|---|---|---|---|
| 1 | `fbclid` OU `ctwa_clid` casa com Insights API últimos 60min | **high** | `Meta · {campaign} · {ad}` |
| 2 | `utm_campaign` + `utm_content` no referral (sem fbclid) | **medium** | `Meta · LeadAd · {utm_campaign} · {utm_content}` |
| 3 | só `referral.sourceUrl` apontando p/ FB/IG (sem UTM) | **low** | `Meta · CTWA · ad?` |
| 4 | nenhum sinal mas mensagem inicial = template Lead Ad | **low** | `Meta · LeadAd · provável` |
| 5 | nada | **none** | `WhatsApp Orgânico` (atual) |

Persistir confiança em campo customizado Zoho `Tracking_Confidence` (criar) ou tag (`atrib_high`, `atrib_medium`, `atrib_low`).

### 2.3 UI tabela de criativos

Card por ad: `12 atribuídos · 8 prováveis · 4 cegos` com tooltip mostrando breakdown por camada. CSS: verde/amarelo/cinza. Cálculo: `SELECT count, sum(amount) FROM Deals WHERE Lead_Source LIKE 'Meta · %{ad_name}%'` agrupado por camada.

---

## 3. Reconciliação Noturna

**Endpoint:** `POST /trafego/reconciliar` (auth via header `X-Cron-Token`)
**Cron:** Railway scheduled `0 3 * * *` (03h BRT)

**Payload:** `{ days: 7, dryRun: false }`

**Algoritmo:**
1. Buscar Zoho `Deals WHERE Created_Time >= NOW-7d AND (Lead_Source IS NULL OR Lead_Source = 'WhatsApp Orgânico' OR Lead_Source = '?')`
2. Para cada deal, buscar `data/meta-attrib/<phone>.json` (capturado pelo webhook WATI)
3. Se houver referral → rodar camadas 1-4 do algoritmo acima
4. Cruzar com Meta Insights API `act_<id>/insights?level=ad&fields=clicks,ad_name,campaign_name&time_range={day-1,day+0}` filtrando ads que rodaram WhatsApp CTWA
5. **NÃO sobrescrever se** (a) Lead_Source não casa com regex `^(WhatsApp Orgânico|\?|null)$`, (b) Owner editou nas últimas 48h (`Modified_Time` > `Created_Time + 1h`), (c) já tem tag `atrib_manual`
6. Update via `zoho.updateDeal(id, { Lead_Source, $append_tags: ['tracking_reconciliado', 'atrib_<conf>'] })`
7. Log em `data/reconciliacao-log/<date>.json` com `{dealId, antes, depois, confianca, fonte}`

**Saída:** `{ scanned, updated, skipped_manual, no_signal, errors }`

---

## 4. UI no Dashboard

- **Banner topo:** se `score < 80` → barra vermelha `Tracking Health: 67% — 3 alertas` clicável vai pra tab.
- **Tab "Tracking Health":** lista vertical dos 9 checks com semáforo, último timestamp, botão "rodar agora" (chama `/trafego/health?force=1`).
- **Card "Atribuição cega":** soma `Amount` de Deals últimos 7d com `Lead_Source = 'WhatsApp Orgânico'` E telefone teve mensagem WATI sem `referral` — exibe `R$ X.XXX em pipeline cego (Y leads)`.
- **Mini-widget rodapé:** `Última reconciliação: 03:14 · 47 enriquecidos · próxima 03:00`.

---

## 5. Estimativa

~3h código: `lib/tracking-health.js` (60min) + `lib/meta-attrib.js` + extensão webhook (60min) + endpoint reconciliação (45min) + UI EJS/CSS (30min). Zero alteração em campanhas Meta — só leitura via Graph API e enriquecimento Zoho.
