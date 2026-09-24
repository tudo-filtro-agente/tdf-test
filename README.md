# tdf-ops (TESTE)

API de operações internas da TDF. Banco zerado, modo `DRY_RUN=true`.

## Endpoints (todos exigem `X-Internal-Key`)

- `GET /health` — público
- `GET /api/clientes` — lista clientes
- `POST /api/clientes` — cria cliente
- `GET /api/pedidos` — lista pedidos
- `POST /api/pedidos` — cria pedido
- `GET /api/kanban` — lista cards kanban
- `POST /api/kanban` — cria card kanban
- `GET /api/rotas` — lista rotas

## Variáveis no Railway

```
DATABASE_URL         = ${{Postgres.DATABASE_URL}}
INTERNAL_API_KEY     = TDF_2026_9kF3xQ7vB2nM8wL5jR4hT6yU1aS0cP9dG
ENVIRONMENT          = test
DRY_RUN              = true
```

## Modo teste

Com `DRY_RUN=true`:
- POSTs retornam `{ "dry_run": true, "echo": {...} }` sem persistir
- Logs vão pro stdout do Railway (visível na aba Logs)

Quando migrar pra produção: trocar `DRY_RUN=false`.
