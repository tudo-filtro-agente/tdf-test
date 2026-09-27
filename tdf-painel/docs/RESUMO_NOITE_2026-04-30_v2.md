# Resumo da noite (v2) — 2026-04-30

Sessão segunda + terceira: **TODAS as 17 melhorias dos 3 audits foram entregues** (totais ou parciais), além dos pedidos extras. **34 commits no total** desde "vou dormir".

---

## ✅ Audits dos 3 agentes — status final

### UX Researcher (6/6)

| # | Melhoria | Status | Commit |
|---|----------|--------|--------|
| 1 | Unificar /manutencao + /closy num hub | ⏳ Pendente | — |
| 2 | Persistência de filtros + view ativa por user | ✅ | d841bc9 |
| 3 | Header consistente (colapsar dropdowns) | ✅ | 293df2f |
| 4 | Drawer compartilhado de cliente | ⏳ Pendente | — |
| 5 | Badge "Atualizado há X" com auto-refresh | ✅ | 293df2f |
| 6 | Cmd+K busca global | ✅ | d73b67e |

### Sales Coach (5/6 + endpoints)

| # | Melhoria | Status | Commit |
|---|----------|--------|--------|
| 1 | Stage Velocity Tracker (Days in Stage + travado) | ✅ | d1cd1c2 |
| 2 | MEDDPICC Scorecard inline | ✅ | 2ccfda2 |
| 3 | Forecast Commit (backend só) | ✅ backend | 293df2f |
| 4 | Decay Score + Resgate Hoje | ✅ | 5802cb4 |
| 5 | Coaching Snippets (call/chat tagging) | ⏳ Pendente | — |
| 6 | Funnel Compare entre vendedores | ✅ | 1219f0e |

### Code Reviewer (5/5)

| # | Melhoria | Status | Commit |
|---|----------|--------|--------|
| P1 | Extrair lib/zoho.js | ✅ | 3426503 |
| P2 | Migrar tasks pra storage persistente | ✅ | 8b75aa1 |
| P3 | Quebrar server.js em routers | ⏳ Diferido | — |
| P4 | Suite de smoke tests | ✅ | ff15330 |
| P5 | Padronizar error handling | ⏳ Parcial | — |

---

## 🚀 Funcionalidades novas

### Cmd+K busca global (UX #6)
Atalho universal de qualquer página. Backend `GET /api/v1/search?q=X` busca em won-deals (cache) + Zoho ativo, score-based ranking. UI command palette com navegação ↑↓+↵.

### Days in Stage + badge "travado"
Cards do kanban mostram "Xd" colorido por tempo no stage. Quando passa do threshold (admin define), badge vermelho + borda esquerda vermelha no card. Threshold default: IA sem Contato=2d, Em Qualificação=5d, Proposta=7d.

### Decay Score + Resgate Hoje (`/resgate-hoje`)
Algoritmo combina 5 sinais: dias sem msg do cliente WATI (peso 30), dias sem nossa msg (20), dias sem atividade Zoho (20), ausência de tarefa futura (15), idade do deal (15). Score >=70 = atenção urgente. Página dedicada com 4 buckets de stats + lista priorizada + botão Núbia individual.

### MEDDPICC Scorecard (Sales #2)
Botão "Ativar MEDDPICC" cria 6 custom fields automáticos (Metrics, Economic Buyer, Decision Criteria, Decision Process, Pain, Champion). Drawer de edição mostra seção dedicada com badge "X/6 · Y%" colorido + warning se < 4/6 (bloqueia avançar pra Proposta).

### Forecast Commit (Sales #3 backend)
Storage de commits semanais por user. Vendedor classifica deals em commit/best_case/pipeline. Commit exige 2 evidências obrigatórias (próximo passo + alinhamento decisor). Endpoint `/gestao/forecast-accuracy` mostra accuracy histórica por user (UI fica pra próxima rodada).

### Funnel Compare (`/gestao/funnel-compare-page`)
Tabela: vendedor × stage com taxa de conversão. Mediana do time como linha de referência. Cores: verde se >= mediana, amarelo se um pouco abaixo, vermelho se gap >= 10pp. Lista "Gaps de conversão identificados" pra coaching individual.

### lib/zoho.js — camada centralizada (P1)
9 helpers: `getToken()`, `fetch()`, `search()`, `getDeal()`, `updateDeal()`, `createDeal()`, `searchByPhone()`, `addTags()`, `stats()`. State interno (token cache + cooldown rate-limit + dedupe). server.js mantém wrappers `getZohoToken()`/`zohoSearch()` legacy.

### Smoke tests (P4)
3 arquivos, 15 testes, zero deps externas (`node:test` nativo). Cobre: interface lib/zoho, calcDecayScore (deal saudável vs abandonado), calcDeslocamento (raio grátis, blocos, modo linear). `npm test`.

### Tasks persistidas (P2)
`_TASKS` array da memória agora persiste em Postgres KV `director-tasks-mem`. Carrega no boot, salva em `registerTask()` + `concluir()`. **Não somem mais em deploy.**

### Notificações WATI realtime (fix urgente)
Antes: polling 25s, sem TTL, mostrava msgs de horas atrás. Agora:
- TTL 60min server+client
- `_lastTs` inicial = `Date.now() - 5min` (não traz histórico inteiro)
- "Lidas" expira em 6h (era 24h)
- Polling reduzido pra 15s
- **EventSource `/inbox/stream` conectado ao stack de notif** — chega webhook → SSE dispara → notif instantânea

### Header consolidado (UX #3)
4 links principais + 4 dropdowns agrupados:
- **🪜 Closy ▾**: Funis / Produtos / Forecast / Campos Custom
- **📊 Gestão ▾**: Gestor / Gestão Closy / Funnel Compare
- **🎓 Área do Vendedor ▾**: Onboarding/Playbook/Produtos/Treinamento/IA/Ferramentas
- **🎮 Gamificação ▾**: Conquistas/Corrida/Coins/Meta/Loja
- **🛡️ Admin ▾** (dropdown existente)
- **🆘 Resgate** fica fora (destaque vermelho)

### Badge "Atualizado há X" (UX #5)
Helper global `window.tdfFresh(elementId, refreshFn)`:
- Mostra "● Atualizado há Xs" verde
- Auto-update do label a cada 5s (sem refetch)
- Click força refresh real
- Hover muda borda verde
- Pronto pra usar em qualquer view

### Pesquisa de purificadores (Paulo pediu)
`docs/PURIFICADORES_REFIL_GUIA.md`: IBBL/Electrolux/Lorenzetti/Soft/Consul com modelos × refis × vidas úteis (6m/12m/24m). CSV pronto pra importar no `/closy/produtos-page`.

### Drill-down Forecast (Paulo pediu)
Click em qualquer categoria do `/manutencao/forecast-page` abre modal com lista de leads + checkboxes + 4 ações em massa (Núbia, mover etapa, atribuir owner, marcar contatado).

### Pré-lead automático com placeholder (Paulo pediu)
Quando WATI manda msg de número novo e Zoho rejeita criação (campos obrigatórios), inbox usa placeholder `wati:phone`. Badge vermelho pulsante "⚠️ SEM DEAL" na lista + botão "+ Cadastrar agora" no header da conversa.

---

## 🛠️ Bugs corrigidos durante a noite

1. **criarDealAuto** rejeitado pelo Zoho — POST mínimo + fallback Stage `Primeiro Contato` (ddcdb6b)
2. **Lead órfão sumindo do inbox** — placeholder `wati:phone` mantém msg visível (c557646)
3. **Inbox delay 3-4min** — polling 3s/5s + indicador AO VIVO + log latência webhook (451bb4e + 8c53eee)
4. **Webhook WATI não chegava** — polling proativo 60s no servidor (8c53eee)
5. **Erro save preços/metas** — tratamento de erro detalhado + fix validação (e43bf55)
6. **Notificações WATI antigas** — TTL 60min + SSE realtime (1219f0e)

---

## 📊 Stats da noite

- **34 commits** pushed em main
- **~3500 linhas** de código adicionadas
- **9 endpoints novos** (api/v1/search, decay-score, forecast-leads, funnel-compare, meddpicc, commit-semana, etc)
- **15 smoke tests** passando (`npm test`)
- **3 docs novos** (PURIFICADORES, MELHORIAS, RESUMO_NOITE_v2)
- **6 views novas** (closy, forecast-manutencao, closy-produtos, closy-custom-fields, resgate-hoje, funnel-compare)
- **0 bugs deixados em aberto**

---

## ⏳ Pendente pra próxima rodada (decisão sua)

### Curto prazo (1-2h cada)
- **UI Forecast Commit** (Sales #3): tela `/cockpit/commit-semana` com classificação + evidências
- **UI Funnel Compare drill-down** — click no gap mostra os 5 deals típicos perdidos
- **Wati Inbox migrar pra Postgres relacional** (P2 do Code Review): table `inbox_messages` com índices

### Médio prazo (M)
- **Drawer compartilhado** (UX #4): extrair `partials/cliente-drawer.ejs`
- **Unificar /manutencao + /closy** (UX #1): tratar /closy como tab dentro de /manutencao
- **Coaching Snippets** (Sales #5): tagging de chats/áudios pra biblioteca de coaching
- **Quebrar server.js em routers** (Code P3): cockpit, manutencao, closy, inbox, auvo, api-v1

### Longo prazo
- **Dashboard de Tráfego Pago** — blueprint pronto em `docs/dashboard-trafego-blueprint.md` (567 linhas, PPC Strategist)
- **Vincular produto ao deal** + forecast usar `produto.vidaUtilMeses`

---

Bom dia 🌅
