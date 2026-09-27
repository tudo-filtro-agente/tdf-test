# Quick Start — Bom dia 🌅

Tudo que entreguei na noite, em ordem de "abrir e usar":

---

## 1. Cadastra os produtos do catálogo (5min)

`/closy/produtos-page` → 📥 **Importar CSV**

Cola o CSV pronto que tá em `docs/PURIFICADORES_REFIL_GUIA.md` — já tem 16 produtos comuns das marcas IBBL/Electrolux/Lorenzetti/Soft/Consul com vidas úteis corretas (6m/12m/24m/36m).

Depois você ajusta os preços que estiverem errados.

---

## 2. Vincula produto ao deal (drawer de edição)

Em `/closy`, abre qualquer deal → ✏️ → seção "🏠 Closy local" → **Produto vinculado (catálogo)** → escolhe.

Forecast e Days in Stage agora usam a vida útil do PRODUTO, não o default genérico da categoria. Resolve o que você falou: "purificador tem várias vidas úteis (6m, 9m, 12m, 24m)".

---

## 3. Configura preços + metas no Forecast

`/manutencao/forecast-page` → ⚙️ **Configurar Preços + Metas**

Ajusta:
- Preço por categoria (bebedouro_refil já tá em R$79 que você passou)
- Meta mensal (ex: refil = R$ 200k pra Cátia/Larissa/Fabiana)
- Responsáveis (separados por vírgula: `catia,larissa,fabiana`)

Se der erro ao salvar, **abre o console (F12)** e me cola a mensagem — coloquei diagnóstico detalhado.

---

## 4. Testa o **Cmd+K** ou **Ctrl+K**

Em qualquer página, aperta `⌘K` (Mac) ou `Ctrl+K` (Windows). Abre command palette com busca em todos os deals (won + abertos). Setas ↑↓, Enter pra abrir.

---

## 5. Resgate Hoje — deals em risco

`/resgate-hoje` (link 🆘 Resgate vermelho no nav)

Decay Score combina: dias sem msg cliente, sem nossa msg, sem atividade Zoho, sem tarefa futura, idade do deal. Score >= 70 = atenção urgente. Lista priorizada com botão 🤖 individual de Núbia.

---

## 6. Click no card do kanban — DRAWER de conversa lado-a-lado

Resolvido o que você falou. Agora cada card tem 2 botões no hover:
- **💬** abre conversa WATI lado-a-lado (drawer 560px direita)
  - Histórico inline + envio + auto-refresh 5s
  - Header: 📞 Z-API (toggle) | 📋 Templates | 🎙️ Diretor IA | ✏️ Editar | ↗ Inbox completo
  - Diretor IA com botão "📋 Usar essa mensagem" copia sugestão pro input
- **✏️** abre editor de campos (drawer original)

Click padrão no card também abre conversa.

---

## 7. Funnel Compare — coaching individual

`/gestao/funnel-compare-page` (admin only, dropdown 📊 Gestão)

Tabela: vendedor × stage com taxa de conversão. Cores: verde se >= mediana, vermelho se gap >= 10pp. Lista "Gaps de conversão identificados" embaixo pra coaching individual.

---

## 8. MEDDPICC scorecard

`/closy/custom-fields-page` → clica **🎯 Ativar MEDDPICC**

Cria os 6 campos automaticamente (Metrics, Economic Buyer, Decision Criteria, Decision Process, Pain, Champion). Idempotente — não duplica se já tem.

Depois, em qualquer deal no `/closy` → ✏️ → seção "🎯 MEDDPICC Scorecard" mostra X/6 colorido + warning se < 4/6.

---

## 9. Commit Semanal

`/commit-semana` (link 📋 Commit no nav)

Classifica seus deals abertos em 3 buckets:
- 🎯 **Commit** (cabeça na guilhotina) — exige 2 evidências (próximo passo + alinhamento decisor)
- 🟡 **Best Case** — alta probabilidade
- ⚪ **Pipeline** — mais distante

Stats de R$ por bucket no topo. Layout 3-colunas.

Admin pode ver histórico de accuracy via `GET /gestao/forecast-accuracy` (UI fica pra próxima).

---

## 10. Smoke Tests

`npm test` roda 15 testes (zero deps externas). Cobre:
- Interface lib/zoho.js
- Decay Score (saudável vs abandonado, cap 100, sinais isolados)
- Cálculo de deslocamento (raio grátis, blocos, modo linear)

---

## 🐛 Bugs corrigidos

| Bug | Solução |
|-----|---------|
| criarDealAuto rejeitado pelo Zoho | POST mínimo + fallback Stage Primeiro Contato |
| Lead órfão sumindo do inbox | Placeholder `wati:phone` + badge SEM DEAL + botão Cadastrar |
| Inbox delay 3-4min | Polling 3s/5s + indicador AO VIVO + log latência |
| Webhook WATI não chegava | Polling proativo 60s no servidor |
| Notificações WATI antigas | TTL 60min + SSE realtime + EventSource |
| Tasks somindo em deploy | Persistido em Postgres KV (P2 do Code Review) |

---

## 🏗️ Refactor estrutural

- **`lib/zoho.js`** extraído (P1) — getToken/search/getDeal/updateDeal/createDeal/searchByPhone/addTags/stats. Centraliza state (token cache + cooldown rate-limit). server.js mantém `getZohoToken()`/`zohoSearch()` legacy.
- **Header consolidado** (UX #3) — 4 dropdowns agrupados (Closy/Gestão/Vendedor/Gamif/Admin) ao invés de 11 elementos flat.
- **Persistência de filtros** (UX #2) — `/manutencao` agora lembra última view + categoria por usuário.
- **`window.tdfFresh()`** (UX #5) — helper global pra badge "Atualizado há Xs" com auto-update.

---

## ⏳ Pendente (decisão sua)

- **UI Forecast Accuracy** — endpoint pronto, falta tela
- **Drawer compartilhado** (UX #4) — extrair `partials/cliente-drawer.ejs` reusado em /closy + /manutencao
- **Coaching Snippets** (Sales #5) — tagging de chats/áudios
- **Wati-inbox migrar pra Postgres relacional** (P2 ainda parcial)
- **Quebrar server.js em routers** (P3 incremental)
- **Dashboard de Tráfego Pago** — blueprint pronto em `docs/dashboard-trafego-blueprint.md`

---

**42 commits no total da noite. Boa noite/bom dia 🌙→🌅**
