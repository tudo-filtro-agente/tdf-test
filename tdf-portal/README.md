# tdf-portal (TESTE)

Portal da TDF, versão de teste. Banco zerado, modo `DRY_RUN=true`.

## Endpoints

- `GET /` — dashboard
- `GET /health` — healthcheck Railway (público)
- `GET /env` — lista variáveis presentes (sem valores)
- `GET /api/test/omie?empresa=X` — lista clientes OMIE (mock no DRY_RUN)
- `GET /api/test/omie/pedidos?empresa=X` — lista pedidos OMIE (mock)
- `GET /api/test/ops` — testa comunicação com tdf-ops
- `POST /api/pedido` — cria pedido (vai pro tdf-ops)

## Variáveis no Railway

```
DATABASE_URL              = ${{Postgres.DATABASE_URL}}
INTERNAL_API_KEY          = TDF_2026_9kF3xQ7vB2nM8wL5jR4hT6yU1aS0cP9dG
TDF_OPS_URL               = http://tdf-ops.railway.internal:8000
ENVIRONMENT               = test
DRY_RUN                   = true
OMIE_MOCOCA_APP_KEY       = 6535926464067
OMIE_MOCOCA_APP_SECRET    = 7bab2f0d7612849671e3cd48773a4eb1
OMIE_TUDODEFILTRO_APP_KEY    = 5297822368839
OMIE_TUDODEFILTRO_APP_SECRET = bc45a24e80ed39f0837187e597073a7a
OMIE_AMERICAN_APP_KEY     = 5593793739534
OMIE_AMERICAN_APP_SECRET  = d6a4594e6c7af672007129578136eca4
```

## Empresas OMIE suportadas

- Mococa
- Tudo de Filtro
- American

## Modo teste

Com `DRY_RUN=true`:
- OMIE retorna dados fictícios realistas (não consome API real)
- tdf-ops também roda em DRY_RUN (POSTs não persistem)

Quando migrar pra produção: trocar `DRY_RUN=false` em ambos.
