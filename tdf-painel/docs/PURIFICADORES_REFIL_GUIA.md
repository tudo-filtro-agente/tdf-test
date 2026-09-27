# Guia de Purificadores Brasil — Refis e Prazos de Manutenção

Pesquisa feita em 2026-04-30 pra alimentar o catálogo do Closy. Todos os prazos abaixo vieram de fontes oficiais (sites das marcas + revendedores).

---

## IBBL (35+ anos no mercado, líder)

| Modelo | Refil | Vida útil | Categoria Closy |
|--------|-------|-----------|-----------------|
| Mio | Avanti | 2.000L ou 6 meses | refil (6m) |
| Avanti | Avanti | 2.000L ou 6 meses | refil (6m) |
| Vivax | Avanti | 2.000L ou 6 meses | refil (6m) |
| FR600 | C+3 | 3.000L ou 6 meses | refil (6m) |
| FR600 Exclusive | CZ+7 | 3.000L ou 6 meses | refil (6m) |
| FR600 Expert | CZ+7 | 3.000L ou 6 meses | refil (6m) |
| FR600 Speciale | CZ+7 | 3.000L ou 6 meses | refil (6m) |
| Evolux | CZ+7 | 3.000L ou 6 meses | refil (6m) |
| E-Due Imaginare | C+3 | 3.000L ou 6 meses | refil (6m) |
| Due | C+3 | 3.000L ou 6 meses | refil (6m) |

**Resumo IBBL**: praticamente todos refis = 6 meses.

---

## Electrolux

| Modelo | Refil | Vida útil | Categoria Closy |
|--------|-------|-----------|-----------------|
| PE11, PE11B, PE11X, PE12, PE15 | WFS023 / Original | 3.000L ou **12 meses** | refil_12m (novo!) |
| PA21, PA21G, PA26, PA26G, PA31, PA31G | WFS023 / Original | 3.000L ou **12 meses** | refil_12m |
| PC41, PC41B, PC41X | Compatível Oxygen | 4.000L ou 6 meses | refil (6m) |
| PH41, PH41B, PH41X | Compatível Oxygen | 4.000L ou 6 meses | refil (6m) |

**Resumo Electrolux**: original 12 meses, compatível 6 meses.

---

## Lorenzetti

| Modelo | Refil | Vida útil | Categoria Closy |
|--------|-------|-----------|-----------------|
| Naturalis | RF-01 / RP-01 | 6.000L ou **12 meses** | refil_12m |
| Gioviale | RPC-01 | 4.000L ou 12 meses | refil_12m |
| Vitale | RV-01 | 2.000L ou 6 meses | refil (6m) |
| Acqua Bella | RV-01 | 2.000L ou 6 meses | refil (6m) |
| Loren Acqua | — | 6 meses | refil (6m) |
| Versatille | — | 6 meses | refil (6m) |

**Resumo Lorenzetti**: linha "Naturalis/Gioviale" = 12 meses, resto 6 meses.

---

## Soft (Everest)

| Modelo | Vida útil | Categoria Closy |
|--------|-----------|-----------------|
| Soft Plus, Slim, Star | 6 meses | refil (6m) |
| Linha tradicional | 6 meses | refil (6m) |

---

## Consul / Brastemp (mesma plataforma)

| Modelo | Vida útil | Categoria Closy |
|--------|-----------|-----------------|
| CIX01, CIX06, Bem Estar, Facilite | 6 meses (compatível) | refil (6m) |
| CPC30, CPC31, CPC35, CPC36 | 6 meses | refil (6m) |
| CPB34 | 6 meses | refil (6m) |

---

## Recomendação pro Closy

A categoria atual `refil` (6 meses) cobre ~70% do mercado. Para **modelos premium 12 meses** (Electrolux original, Lorenzetti Naturalis/Gioviale), recomendo:

### Opção A — Adicionar nova categoria `refil_12m`
- Pró: separação clara, forecast preciso por categoria
- Contra: requer migração + atualizar `VIDA_UTIL` em server.js

### Opção B — Cadastrar produtos individualmente com `vidaUtilMeses` por produto
- Pró: já funciona, granular por SKU
- Contra: forecast usa categoria default ainda; precisa ajustar pra usar `vidaUtilMeses` do produto

**Recomendado: B + ajuste no forecast pra usar `produto.vidaUtilMeses` quando deal tiver produto vinculado**, senão fallback `VIDA_UTIL[cat].meses`.

---

## CSV pronto pra importação no Closy

Formato: `nome,categoria,precoManutencao,vidaUtilMeses,descricao`

Cole isso em `/closy/produtos-page` → "📥 Importar CSV" → modo "Substituir":

```csv
nome,categoria,precoManutencao,vidaUtilMeses,descricao
Refil IBBL Avanti (Mio/Avanti/Vivax),refil,150,6,2.000L · 6 meses · IBBL original
Refil IBBL C+3 (FR600/E-Due/Due),refil,180,6,3.000L · 6 meses · IBBL
Refil IBBL CZ+7 (FR600 Exclusive/Expert/Speciale/Evolux),refil,220,6,3.000L · 6 meses · IBBL
Refil Electrolux WFS023 Original (PE11/PE12/PE15/PA21/PA26/PA31),refil,250,12,3.000L · 12 meses · Electrolux original
Refil Electrolux Compatível Oxygen (PC41/PH41),refil,140,6,4.000L · 6 meses · compatível
Refil Lorenzetti RF-01/RP-01 (Naturalis),refil,200,12,6.000L · 12 meses · Lorenzetti
Refil Lorenzetti RPC-01 (Gioviale),refil,180,12,4.000L · 12 meses · Lorenzetti
Refil Lorenzetti RV-01 (Vitale/Acqua Bella),refil,140,6,2.000L · 6 meses · Lorenzetti
Refil Soft Plus/Slim/Star,refil,160,6,6 meses · Soft Everest
Refil Consul CIX/CPC,refil,150,6,6 meses · compatível Consul/Brastemp
Refil Bebedouro Coluna 10",bebedouro_refil,79,6,Bebedouro coluna pressão
Refil Bebedouro Industrial,bebedouro_refil,120,6,Bebedouro AF/refrigerador industrial
Elemento Filtrante Inox 430,elemento,1200,12,Filtro de entrada residencial inox premium
Elemento Filtrante Fibra American,elemento,890,12,Filtro de entrada padrão
Iron Free Manutenção Anual,iron_free,2200,24,Substituição de mídia poço artesiano
Scale Stop Recarga,scale_stop,1500,36,Abrandador residencial
```

---

## Próximos passos sugeridos pro Paulo

1. Decidir A ou B (recomendo B)
2. Importar CSV acima (já com bebedouro_refil = R$79 que você pediu)
3. **Cadastrar produto vinculado ao deal** — adicionar campo `produtoId` no manut-meta + select no drawer
4. Forecast usar `produto.vidaUtilMeses` quando deal tem produto vinculado

Quer que eu implemente o item 3 + 4 agora?
