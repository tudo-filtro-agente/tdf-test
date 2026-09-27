# Dashboard de Criativos Meta — Spec v1

Galeria visual de criativos Meta Ads dentro do Portal TDF. Foco: dev solo (Paulo) decide escalar/pausar em 30 segundos.

---

## 1. Métricas por criativo (não por campanha)

Todas relativas à **mediana do ad set** no mesmo período (last_7d default).

| KPI | Fórmula | Fonte Meta |
|---|---|---|
| Hook Rate | `video_3sec_watched_actions / impressions` | insights |
| Hold Rate | `video_15_sec_watched_actions / video_3sec_watched_actions` | insights |
| CTR (link) | `inline_link_clicks / impressions` | insights |
| CPM | `spend / impressions * 1000` | insights |
| Frequência | `impressions / reach` | insights |
| CPL | `spend / actions[lead]` (Lead Ad) | insights |
| CPC site | `spend / actions[link_click]` (Conv Ad) | insights |
| CR CRM | `deals_ganhos / leads` via join Zoho por `lead_source_ad_id` | Zoho + match utm_content |
| Days running | `today - ad.created_time` | ad object |
| Delta CTR 3d | `ctr_last_3d / ctr_prev_3d - 1` | insights time_increment=1 |

**Comparativo:** todo número no card vem com badge `vs mediana ad set` (verde se >= mediana, vermelho se < 70% mediana). Nunca mostrar absoluto sozinho — bom CTR pra Lead Ad B2C bebedouro (1.8%) é ruim pra refil B2C remarketing (3.5%).

---

## 2. Score composto (0-100)

```
score = (
    0.30 * normalize(ctr_rel)        // CTR vs mediana ad set
  + 0.25 * normalize(hook_rel)       // Hook Rate vs mediana (vídeo) ou peso=0 se imagem
  + 0.25 * normalize(cpl_rel_inv)    // 1/CPL relativo
  + 0.10 * normalize(hold_rel)       // Hold Rate
  + 0.10 * fatigue_penalty           // 1.0 se freq<2.5, 0.5 se 2.5-3.5, 0.0 se >3.5
) * 100
```

`normalize(x_rel)` = clamp((x / mediana_adset) / 2, 0, 1). Imagens redistribuem o peso de hook/hold pra CTR.

Cor: verde >= 70, amarelo 40-69, vermelho < 40.

---

## 3. Layout "Galeria de Criativos"

Grid CSS `repeat(auto-fill, 280px)`. Default sort: score desc. Filtros topo: ad account, campaign, ad set, status, tipo (vídeo/imagem/carrossel), período (7d/14d/30d).

**Card 280x280:**
- Thumbnail 280x180 (`image_url` ou `thumbnail_url` do creative)
- Linha 1: score badge + estado (active/paused) + tag fadiga
- Linha 2: 4 KPIs grid 2x2 — CTR, Hook Rate, CPL, Freq (cada um com delta vs mediana)
- Linha 3: idade `12d` + spend acumulado `R$ 1.240`
- Hover: overlay com nome do ad + ad set + dropdown ações

---

## 4. Buckets automáticos (chips no topo)

TDF tem ciclo de venda 15-30d em B2C bebedouro/filtro entrada — todo bucket exige **mínimo 7 dias rodando** pra evitar matar criativo cedo.

| Bucket | Critério (AND) |
|---|---|
| Campeões | score >= 80 AND days_running >= 7 AND spend_7d >= R$300 AND freq < 2.5 AND active |
| Em fadiga | days_running >= 7 AND (freq > 3.5 OR delta_ctr_3d <= -0.30) AND active |
| Fracos | days_running >= 7 AND impressions >= 5000 AND score < 30 AND active |

Conversion Ads com tracking CRM ok ganham bônus: se `CR_CRM >= mediana * 1.2`, força entrar em Campeões mesmo com score 70-79.

---

## 5. Ações por card

**v1 (Meta API direta):**
- Pausar criativo — `POST /{ad_id}` body `status=PAUSED`
- +30% budget ad set — `POST /{adset_id}` `daily_budget=current*1.3`
- -30% budget ad set — idem * 0.7

**v1.1:**
- Duplicar com variation IA: pega `creative.body` + `creative.title`, manda pro Claude com prompt `gerar 3 hooks novos B2C bebedouro mantendo dor + benefício, max 40 char`, devolve preview, Paulo escolhe, cria novo ad com `POST /act_{id}/ads` reusando `image_hash`.
- Mover ad pra outro ad set — `POST /{ad_id}` `adset_id=novo`.

Toda ação grava em `audit_log` (user, ad_id, action, before, after) — sem isso não rastreia se a mudança ajudou.

---

## 6. Endpoints Meta Marketing API (v19.0+)

```
GET /v19.0/act_{ad_account_id}/ads
  ?fields=id,name,status,creative,adset_id,campaign_id,created_time
  &limit=200

GET /v19.0/{ad_id}/insights
  ?fields=impressions,reach,frequency,spend,cpm,ctr,inline_link_clicks,
          actions,cost_per_action_type,
          video_3_sec_watched_actions,video_15_sec_watched_actions
  &date_preset=last_7d
  &level=ad

GET /v19.0/{creative_id}
  ?fields=id,name,thumbnail_url,image_url,video_id,object_story_spec,body,title

GET /v19.0/{ad_id}/insights
  ?time_increment=1&date_preset=last_7d   // pra delta_ctr_3d

GET /v19.0/act_{id}/adcreatives?fields=thumbnail_url,image_url   // batch
```

**Cache:** insights em SQLite `creative_insights` (refresh 1x/h via cron); creative metadata cache 24h. Rate limit Meta: usar `batch` endpoint pra agrupar até 50 calls.
