# Integração — Módulo Auditoria CRM

Esse módulo é **plugável**. Não toca em nenhum arquivo existente. Você só precisa
adicionar **uma linha** no `server.js` pra ativar.

## Arquivos novos (já criados)

```
lib/auditoria-crm/
├── index.js          # Entrypoint — exporta mount(), log(), emitAlert()
├── db.js             # Schema + queries
├── rules.js          # 15 regras de detecção suspeita
├── seed.js           # Mock de ~600 eventos
└── routes.js         # 11 endpoints REST + 4 EJS pages

views/
├── auditoria-crm.ejs                    # Tela principal (cards + tabela + modal)
├── auditoria-crm-influencia-ia.ejs      # Com IA vs Sem IA
├── auditoria-crm-distribuicao.ejs       # Distribuição de leads
└── auditoria-crm-vendedores.ejs         # Ranking + score

docs/
└── auditoria-crm.md                     # Manual pra Claude/Núbia/n8n logarem
```

## Plug no server.js (1 linha)

Adicione **no final** do `server.js`, depois que `app` e `_pgPool` já existirem
(qualquer lugar após o bloco `pgInit()`):

```js
require('./lib/auditoria-crm').mount(app, { pool: _pgPool });
```

Ou, se preferir que o módulo crie o próprio pool:

```js
require('./lib/auditoria-crm').mount(app);
```

Pronto. Acesse:

- `https://<portal>/auditoria-crm`
- `https://<portal>/auditoria-crm/influencia-ia`
- `https://<portal>/auditoria-crm/distribuicao-leads`
- `https://<portal>/auditoria-crm/vendedores`

## Adicionar link no menu (opcional)

Onde quer que o portal renderize a navegação principal (menus admin
geralmente moram em `views/layout.ejs`), adicione:

```html
<a href="/auditoria-crm" class="nav-link <%= activePage === 'auditoria-crm' ? 'active' : '' %>">
  🛡️ Auditoria CRM
</a>
```

Como você pediu pra **não alterar nada existente**, esse passo fica a seu critério.
As 4 telas funcionam standalone (URL direta) mesmo sem item no menu.

## Boot — o que acontece

1. `mount()` cria as tabelas `crm_audit_logs` e `crm_audit_alerts` se não existirem (idempotente).
2. Se `TDF_AUDIT_SEED=1` (env) e o banco estiver vazio, planta ~600 eventos mock.
3. Inicia cron interno de **10 min** rodando regras de detecção.
4. Sobe rotas `/auditoria-crm` (UI) e `/api/auditoria-crm/*` (API).

## Variáveis de ambiente

```bash
DATABASE_URL=postgres://...           # já usado pelo portal — reusa
TDF_AUDIT_SVC_KEY=algumacoisa-segura  # chave para POSTs externos (Claude/Núbia/n8n)
TDF_AUDIT_SEED=1                      # planta mock no primeiro boot (opcional)
```

Se `TDF_AUDIT_SVC_KEY` não estiver setada, o módulo aceita POSTs sem auth (modo dev).

## Endpoints REST

| método | rota | descrição |
|---|---|---|
| GET  | `/api/auditoria-crm/overview` | 16 cards do topo |
| GET  | `/api/auditoria-crm/logs` | tabela paginada com filtros |
| GET  | `/api/auditoria-crm/logs/:id` | detalhe de um log |
| POST | `/api/auditoria-crm/log` | **registra ação (Claude/Núbia/n8n usam aqui)** |
| GET  | `/api/auditoria-crm/alerts` | lista de alertas abertos |
| POST | `/api/auditoria-crm/alerts/:id/resolve` | marca alerta como resolvido |
| POST | `/api/auditoria-crm/alerts/:id/ignore` | ignora alerta |
| GET  | `/api/auditoria-crm/influencia-ia` | dados da tela Influência IA |
| GET  | `/api/auditoria-crm/distribuicao-leads` | dados da tela Distribuição |
| GET  | `/api/auditoria-crm/vendedores` | ranking + scores |
| GET  | `/api/auditoria-crm/timeline/:crm_record_id?module=Leads` | timeline unificada |
| POST | `/api/auditoria-crm/admin/run-rules` | força execução das regras |
| POST | `/api/auditoria-crm/admin/seed` | planta mock manualmente |
| GET  | `/api/auditoria-crm/admin/health` | counts pra healthcheck |

## Como Claude/Núbia/n8n logam

Veja `docs/auditoria-crm.md` para receitas completas. Resumo:

```bash
curl -X POST $PORTAL_URL/api/auditoria-crm/log \
  -H 'Content-Type: application/json' \
  -H "x-tdf-svc-key: $TDF_AUDIT_SVC_KEY" \
  -d '{
    "action_type": "lead_assigned",
    "action_origin": "claude_director_ia",
    "actor_name": "Claude Director",
    "crm_module": "Leads",
    "crm_record_id": "529481000123",
    "crm_record_name": "João Silva - Recife",
    "seller_responsible_after": "Guilherme",
    "reason": "Roteamento por produto + carga + score",
    "rule_triggered": "distribuicao_inteligente_v2",
    "confidence_score": 82
  }'
```

Resposta:

```json
{ "ok": true, "id": 12345, "created_at": "2026-05-07T..." }
```

## Smoke test local

```bash
cd ~/tdf-portal
TDF_AUDIT_SEED=1 npm run dev
# em outro terminal:
curl http://localhost:3000/auditoria-crm/_status
curl http://localhost:3000/api/auditoria-crm/overview
```

Abra `http://localhost:3000/auditoria-crm`.

## Reset do mock

```bash
curl -X POST http://localhost:3000/api/auditoria-crm/admin/seed \
  -H 'Content-Type: application/json' \
  -d '{"force": true}'
```

## Próximos passos (não nesta entrega)

- Webhook do Zoho CRM disparando POST /log a cada criação/alteração (cobre todos os 8 eventos da spec)
- Webhook WATI/Z-API espelhando mensagens em logs `whatsapp_message_sent`
- Integração GoTo via S3 archive (Project memory: `project_goto_recordings_aws.md`)
- Integração SalesIQ
- Cruzamento Meta Lead Ads cego (memory: `project_meta_leadgen_atribuicao_cega.md`) usando o `metadata_json` do log com `campaign_id` reconstituído via WATI messageReferral
- Drill por canal e por campanha nos cards
- Alerts críticos do dashboard executivo aparecendo no Cliq #operacional ou WATI Morgana

Tudo isso é **aditivo** ao módulo: você só liga novos webhooks ao mesmo
`POST /api/auditoria-crm/log`. Sem mexer no schema nem nas telas.
