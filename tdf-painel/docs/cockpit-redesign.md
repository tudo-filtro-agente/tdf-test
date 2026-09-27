# Cockpit Redesign — "Meu Dia em Tempo Real"

## 1. Audit do que existe hoje

`views/cockpit.ejs` tem 1.598 linhas e 14+ blocos empilhados sem hierarquia: KPIs → Meta → Destaques → Premiação → Patente → Anual → Forecast → Score/Checklist/Metas → GoTo → Score Detalhado → Closy → Diretor IA → Raio-X → Faça Agora → Propostas. O único bloco com ação 1-click ("Faça Agora") está no **meio-fim** da página, atrás de 6 cards de gamificação. `/cockpit/data` (server.js:898–1116) já retorna tudo que precisa para priorização (tier, hoursAgo, propostas atrasadas, deals ordenados), mas a view enterra essa informação. Vendedor **não entende em 5 segundos o que fazer** — ele rola até achar. Não há seletor de período histórico (apenas mês corrente vs. ontem vs. mesmo dia mês passado, hardcoded).

## 2. Redesign — 3 zonas

### Zona 1: AGORA (topo, alto contraste, sticky)
3–5 cards ordenados por impacto em receita. Critérios de entrada (top 5):

| Trigger | Critério | Ação 1-click |
|---|---|---|
| Proposta esfriando | Stage=Proposta, hoursAgo≥48h, Tier∈{Diamante,Ouro} | Ligar + WATI |
| Diamante parado | Tier=Diamante, hoursAgo>2h, Stage≠Proposta | WATI direto |
| Tarefa vencendo | tarefas-closy, due<30min | Marcar feita / Snooze |
| Lead novo sem contato | Created hoje, Stage=Leads Novos | Atender (WATI) |
| Decay Score >70 | (já calculado) | Reengajar |

Cada card: nome + cidade + valor + tempo parado + 2 botões (CRM, WATI). Checkbox "✓ feito" oculta o card e dispara refresh leve. Auto-refresh 60s. Badge `urgente-count` sempre no topo.

### Zona 2: HOJE (meio)
Sem gamificação:
- **Tarefas hoje** (já existe `tarefas-closy` localStorage)
- **Vendas hoje**: count + R$ (filtrar `wonDeals` por `Closing_Date=today`)
- **Atendidos vs Aguardando**: derivado de `prioritized` (com/sem activity hoje)
- **Mini funil pessoal**: Leads Novos→Qualif→Proposta→Ganho — usa `pipeline.stages` que já existe

### Zona 3: HISTÓRICO (rodapé, colapsado por default)
Adiciona seletor de período que hoje **não existe**:
- Botões Hoje / Ontem / 7d / 30d / **Personalizado** (date range)
- Gráfico de barras: vendas/dia + linha de meta diária
- KPI Δ% "esse período vs período anterior" (vendas, faturamento, ticket, conversão Qualif→Proposta)
- Ranking dele: "3º de 5 no Bebedouro" **sem nome dos outros** + Δ vs líder em R$

## 3. Indicadores didáticos

- **"% atrás da meta"**: traduzir em ritmo recuperável. "Faltam 8 vendas em 12 dias úteis = 0,7/dia. Hoje 0. Amanhã 1 e volta ao ritmo." Nunca só %.
- **Conversão caindo (gancho coaching)**: tile na Zona 3 — "Qualif→Proposta últimos 7d: 42% (média 30d: 58%). 3 deals que pararam: [lista]". Convida, não acusa.
- **Vermelho vs info**:
  - **Vermelho pulsante**: Diamante parado >2h, Proposta Quente >72h, tarefa vencida, dia 25 do mês com <60% meta
  - **Amarelo**: Ouro >24h, conversão caiu >15pp em 7d, ticket médio caiu >20%
  - **Info**: o resto. Regra: se não dá pra agir em 30min, não é vermelho.

## 4. Mudanças S — fazer hoje

| # | Onde | O que | Esforço | Sucesso |
|---|---|---|---|---|
| 1 | `cockpit.ejs:185–204` | Mover "Faça Agora" para **antes** do `<div id="kpis">` (linha 28) | S | Tempo até 1ª ação cai (click WATI/CRM) |
| 2 | `cockpit.ejs:37–62` | Colapsar Premiação+Patente+Anual em 1 accordion fechado | S | Scroll até "Faça Agora" cai 60%+ |
| 3 | `cockpit.ejs:264–267` | Adicionar 5º KPI Raio-X **"Próxima ação"** com nome do top deal Zona 1 + countdown até virar vermelho | S | Closer abre portal e já vê nome a perseguir |

## 5. Mudanças M/L

**M — Seletor de período histórico** (novo `/cockpit/historico?from=&to=`, refatora `cockpit/data` para aceitar range, ~80 linhas + cache por período). **ROI alto**: hoje closer não auto-avalia se está melhorando. Vira auto-coaching e prepara 1:1 sem abrir Zoho. **Faz sentido.**

**L — Conversão por estágio com alerta de drop**: rolling 7d/30d Stage→Stage por closer, baseline do time, drop >15pp. Exige snapshot diário (Zoho não consulta histórico barato). ~2 dias. **ROI alto SE houver agenda semanal de coaching real** — sem isso, "sua conversão caiu" vira feature parada. Condicional.

## Regra estrutural

Topo = próximos 30min. Meio = placar/agenda do dia. Rodapé = auto-avaliação histórica. Gamificação/premiação/ranking colapsados por padrão. Cada item da Zona 1 precisa ter ação 1-click ou não merece estar lá.
