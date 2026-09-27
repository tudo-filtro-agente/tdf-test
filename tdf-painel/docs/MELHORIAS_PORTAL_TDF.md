# Melhorias sugeridas — Portal TDF

Consolidação de 3 audits feitos por agentes especialistas em **2026-04-30**.

---

## 🎨 UX Researcher — 6 melhorias de experiência

### 1. **Unificar /manutencao + /closy num hub com tabs** (M / Alto)
Hoje vendedor tem 3 entradas pro mesmo cliente. Drawers diferentes (`mt-drawer` vs `cz-drawer`) com campos sobrepostos. Sugestão: tratar `/closy` como tab dentro de `/manutencao`, reusar o mesmo drawer.

### 2. **Persistência de filtros + view ativa por user** (S / Alto) ✅ IMPLEMENTADO
LocalStorage pra view ativa, categoria selecionada, busca atual. Cross-page. **Deployado nesse commit**.

### 3. **Header consistente: nav lotado** (S / Médio-Alto)
6 cores competindo, ~12 elementos visíveis, quebra em mobile. Reduzir a 4 cores semânticas, colapsar Forecast/Funis/Catálogo num dropdown "🪜 Closy ▾", adicionar hamburger mobile.

### 4. **Drawer compartilhado de cliente** (M / Alto)
Extrair `views/partials/cliente-drawer.ejs` com todas as ações + campos. Cada página injeta contexto. Padronizar atalhos Esc/J/K.

### 5. **Substituir botão "Atualizar" por badge "Atualizado há Xs"** (S-M / Médio)
Vendedor clica compulsivamente. Auto-refresh silencioso 60-120s. Toast quando chega dado novo ("3 leads novos").

### 6. **Cmd+K busca global de cliente** (M / Alto)
Comando palette pra abrir cliente sem trocar de página. Busca `/api/contacts/search`, abre drawer compartilhado. Padrão moderno SaaS.

**Fora da prioridade**: tipografia inconsistente, drawer width varia, acessibilidade WCAG.

---

## 💼 Sales Coach — 6 melhorias de gestão comercial

### 1. **Stage Velocity Tracker** (M)
"Days in Stage" em cada card + heatmap em /gestao-closy mostrando tempo médio por stage por vendedor. Badge vermelho quando deal > 2x mediana do time. Endpoint novo `/api/deals/velocity` agregando Stage_History do Zoho.

### 2. **MEDDPICC Scorecard inline no card** (M)
6 checkboxes (Metrics, Economic Buyer, Decision Criteria, Decision Process, Pain, Champion) puxando de custom fields Zoho. Score 0-6. Bloquear movimentação pra "Proposta" se score < 4.

### 3. **Forecast Commit com evidência obrigatória** (M)
Tela `/cockpit/commit-semana` onde vendedor classifica top 10 deals em Commit/Best Case/Pipeline. Cada Commit exige 2 evidências. Dashboard compara Commit vs Closed semana a semana.

### 4. **Decay Score (sinais de risco pré-stall)** (M)
Job noturno calcula 0-100 por deal aberto: dias desde última msg WATI bidirecional + última atividade Zoho + ausência de tarefa futura + age vs cycle médio. Score >70 entra em "Resgate Hoje" no /cockpit.

### 5. **Coaching snippets — biblioteca** (L)
Tag em chats WATI ou áudios GoTo (`objecao_preco`, `descoberta_top`). Gestor revisa, atribui "Lição da Semana". Histórico no perfil.

### 6. **Funnel Compare entre vendedores** (M)
Taxa de conversão stage→stage por vendedor + mediana do time. Identifica gargalo individual ("Fabiana Qualificado→Proposta 22% vs time 41%"). Drill-down 5 deals típicos perdidos.

**Sequência**: 1+4 (puro código, ROI imediato) → 2+3 (mudança hábito) → 6 (1:1) → 5 (longo prazo).

---

## 🔧 Code Reviewer — 5 melhorias técnicas

### 🔴 P1 — Extrair `lib/zoho.js` (M / Risco alto se não fizer)
`server.js` tem 16+ `fetch('https://www.zohoapis.com/...')` espalhados. Cada novo endpoint reimplementa retry/refresh-token. Token expira em 1h — bug de refresh = falha silenciosa em 16 lugares. Centralizar em camada com retry/log/rate-limit/cache.

### 🔴 P2 — Migrar dados quentes do KV pra Postgres relacional (L / Risco alto)
`kv_store` virou banco de tudo. Cada save reescreve JSON inteiro, cada load traz tudo pra RAM. Migrar nessa ordem:
1. **`wati-inbox`** → tabela `inbox_messages(deal_id, msg_id, from, ts, body, status)` — write-heavy
2. **`propostas-closy`** → `propostas(id, deal_id, json, created_at)`
3. **`tasks`** (em-memória, l.1407) → tabela `tasks` — **hoje somem em cada deploy Railway**
4. `coins` → tabela com índice por user

Manter no KV: configs (`closy-card-config`, `closy-custom-views`, `manut-precos`, etc) — read-mostly, pequenos.

### 🟡 P3 — Quebrar server.js em routers por domínio (L incremental)
12.501 linhas, ~150 rotas, sem fronteira. Domínios claros:
- `routes/cockpit.js` · `routes/manutencao.js` · `routes/closy.js` · `routes/inbox.js`
- `routes/auvo.js` · `routes/whatsapp-admin.js` · `routes/api-v1.js` (já deveria estar separada)

Fazer por domínio inteiro, não rota a rota.

### 🟡 P4 — Suite de smoke-tests nos 5 endpoints críticos (S / Risco alto se não fizer)
Zero testes hoje. Cada deploy pode quebrar silenciosamente. Testar (vitest + supertest):
- `POST /webhooks/wati` com payload real → assert KV recebeu
- `POST /webhooks/zapi` idem
- `PUT /api/v1/deals/:id/field/:name` com X-API-Key valida/inválida
- `GET /cockpit/data` retorna 200 com keys esperadas
- `getZohoToken()` refresh quando expirado (mock fetch)

ROI altíssimo. Hoje só descobre regressão quando vendedor reclama.

### 💭 P5 — Padronizar error handling + abolir fallback `kvOrFile`
- 353 try/catch espalhados (alguns endpoints com 3+, outros zero) — substituir por `asyncHandler(fn)`
- `kvOrFile` (l.80) tem fallback pra arquivo JSON local — Railway é efêmero, esconde bug "key não existe ainda". Após P2, remover e deletar `data/*.json`
- Naming: padronizar `repo.X.get/set/list` (storage) e `svc.X.do()` (ações)

**Sequência recomendada:**
- Semana 1: P1 (lib/zoho.js)
- Semana 2: P4 (testes)
- Semana 3-4: P2 (migrar inbox + propostas + tasks)
- Background: P3 incremental, 1 domínio/semana
- P5 nas zonas que tocar

**NÃO fazer agora**: reescrever EJS→React, separar Closy em service, adicionar TypeScript.

---

## 🎯 Top 5 quick wins — ordem recomendada

Combinando os 3 audits, eis o que tem maior ROI / menor esforço:

| # | Tarefa | Origem | Esforço | Impacto |
|---|--------|--------|---------|---------|
| 1 | Persistência de filtros (localStorage) | UX #2 | S ✅ | Alto |
| 2 | Days in Stage no card kanban | Sales #1 | M | Alto |
| 3 | Decay Score noturno + lista "Resgate Hoje" | Sales #4 | M | Alto |
| 4 | Suite smoke-tests nos webhooks | Code P4 | S | Alto |
| 5 | Cmd+K busca global de cliente | UX #6 | M | Alto |

**Ações longas que não dá pra adiar muito:**
- Extrair `lib/zoho.js` (Code P1) — desbloqueia testes
- Migrar `wati-inbox` pra Postgres (Code P2) — antes que o JSON estoure 10MB

---

Próximo passo prático: o item 1 já tá implementado. Itens 2 e 3 do quick-win são bem combináveis (~3-4h juntos) e dão ROI imediato pro gestor.
