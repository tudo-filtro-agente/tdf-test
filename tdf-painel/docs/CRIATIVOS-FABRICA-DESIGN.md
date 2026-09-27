# Fábrica de Criativos `/criativos` — Design Técnico v1

> Autor: Claude + Paulo · 15/07/2026 · Status: proposta para aprovação
> Escopo: portal (pedidos/roteiros/aprovação/galeria) + VPS Hermes (render) + Drive (assets) + WATI/CRM (distribuição)

---

## 1. Auditoria — Portal (estado atual)

| Item | Estado | Implicação pro projeto |
|---|---|---|
| Stack | Node/Express + EJS, `server.js` monolito, sessão em memória | Novo módulo segue o padrão: rotas no server.js + views EJS; sem framework novo |
| Auth | `USERS` estático; `role` (admin/closer/posvenda) + `nivel` (ceo/gestor) | Aprovação de roteiro: `role==='admin'` (Paulo/Luis). Criação de pedido: admin + marketing (criar user `lucas.mkt`) |
| Banco | **Postgres no Railway** (`DATABASE_URL`), pool pronto, `kv_store` JSONB + `deal_overrides` | Temos banco relacional de verdade — o módulo usa TABELAS próprias (não kv_store) |
| Storage | Volume persistente `/app/media` (biblioteca, resultados, instalacoes) | Vídeos prontos + thumbs moram em `/app/media/criativos/` |
| Upload | `x-upload-key` (`BIBLIOTECA_UPLOAD_KEY`) streaming; **GOTCHA: exigir Content-Type octet-stream** | Mesma chave protege o canal VPS→portal (worker autentica com ela) |
| Deploy | push main → Railway auto-deploy | Migrations: `CREATE TABLE IF NOT EXISTS` no boot (padrão da casa) |
| Tema | tokens `var(--*)` claro/escuro obrigatórios | Telas novas seguem |

## 2. Auditoria — VPS / repositório de vídeo

| Item | Estado |
|---|---|
| Máquina | Hetzner 167.233.224.243, **2 vCPU / 3.7GB / sem GPU** → **1 render por vez, ~8 min/vídeo** |
| Engine | MoneyPrinterTurbo em `~/MoneyPrinterTurbo` (uv/Python 3.11) — CLI completa **e** API REST FastAPI (`POST /videos`, `GET /tasks/{id}` com estado+progresso, stream/download) |
| Portas | 8080/8081 (Hermes) e 8090/8091 (node) ocupadas → API do MPT sobe em **localhost:8082**, sem exposição pública |
| Pipeline validada | roteiro fixo → TTS Edge pt-BR → legendas → materiais locais em ordem (`--video-source local`) → **pós-processo ffmpeg: watermark logo+WhatsApp** → MP4 |
| Assets | `~/MoneyPrinterTurbo/assets-tdf/` — ver §3 |
| Rede | VPS **não tem HTTPS público** → integração é **pull**: worker na VPS consulta o portal (polling), nunca o contrário |

## 3. Auditoria — Assets (Drive + curadoria)

```
~/MoneyPrinterTurbo/assets-tdf/
├── logotipo/            # lockup TDF (todas resoluções) + American Filter branco/preto
├── carrossel-filtros/   # 11 fotos REAIS de instalação FE (com selo BF — versões limpas em prontos/)
├── bebedouro-carrossel/ # 20 artes bebedouro
├── carrossel-black/     # 4 artes
├── videos-produto/      # institucionais (AF inox, Iron Free, TAC ScaleStop)
└── prontos/             # processados: instalacao-N.png (sem selo), card-cta.png, watermark.png
~/curadoria-<tema>/      # clipes Pexels APROVADOS visualmente (dura, condominio, ...)
```
- Drive raiz "TUDO DE FILTRO" compartilhado por conta; **download em massa bloqueado** (pastas FOTOS/VIDEOS precisam de link público pro gdown) — risco R6.
- **Decisão:** o portal NÃO fala com o Drive. A VPS é o espelho canônico de assets (`sync-drive.sh` semanal quando o link liberar). O portal referencia assets por **asset_id** (catálogo sincronizado da VPS pro banco).

## 4. Modelo de dados (Postgres do portal)

```sql
-- catálogo de dimensões (seed inicial vem do PRD; editável por admin)
CREATE TABLE crea_dim (id SERIAL PRIMARY KEY, tipo TEXT NOT NULL, -- produto|problema|estagio|objetivo|formato|gancho
  slug TEXT NOT NULL, label TEXT NOT NULL, ativo BOOL DEFAULT true, meta JSONB DEFAULT '{}', UNIQUE(tipo, slug));

-- config central: fones, garantias, claims globais (NUNCA no prompt)
CREATE TABLE crea_config (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_by TEXT, updated_at TIMESTAMPTZ DEFAULT NOW());
-- ex.: {"whatsapp":"(12) 98285-5000","fone":"(12) 3876-6000","slogan":"Eleve o nível da sua água"}

-- motor de regras (bloqueia/sinaliza roteiro)
CREATE TABLE crea_regras (id SERIAL PRIMARY KEY, codigo TEXT UNIQUE, descricao TEXT NOT NULL,
  severidade TEXT NOT NULL CHECK (severidade IN ('bloqueia','sinaliza')),
  padrao_regex TEXT,            -- ex.: '(?i)(elimina|remove) 100%'
  escopo JSONB DEFAULT '{}',    -- {"produto":["scale-stop"]} vazio = global
  ativo BOOL DEFAULT true);

-- biblioteca de templates de roteiro (versionada)
CREATE TABLE crea_templates (id SERIAL PRIMARY KEY, nome TEXT NOT NULL,
  produto TEXT NOT NULL, problema TEXT, estagio TEXT, objetivo TEXT NOT NULL, gancho TEXT,
  corpo TEXT NOT NULL,          -- com placeholders {{whatsapp}} {{fone}} {{slogan}}
  cta TEXT NOT NULL, duracao_alvo INT DEFAULT 55,
  imagens_recomendadas JSONB DEFAULT '[]', imagens_proibidas JSONB DEFAULT '[]',
  claims_permitidos JSONB DEFAULT '[]', claims_proibidos JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','aprovado','arquivado')),
  versao INT NOT NULL DEFAULT 1, template_pai INT REFERENCES crea_templates(id), -- versionamento: nova versão = nova linha
  aprovador TEXT, aprovado_em TIMESTAMPTZ, criado_por TEXT, criado_em TIMESTAMPTZ DEFAULT NOW());

-- catálogo de assets da VPS (sincronizado)
CREATE TABLE crea_assets (id SERIAL PRIMARY KEY, path_vps TEXT UNIQUE NOT NULL, tipo TEXT NOT NULL, -- foto_produto|clipe_curado|arte|card|video_produto
  produto TEXT, tema TEXT, descricao TEXT, aprovado BOOL DEFAULT true, thumb_url TEXT, criado_em TIMESTAMPTZ DEFAULT NOW());

-- o criativo (pedido → vídeo)
CREATE TABLE crea_criativos (id SERIAL PRIMARY KEY, uuid TEXT UNIQUE NOT NULL, -- idempotência
  produto TEXT NOT NULL, problema TEXT, estagio TEXT, objetivo TEXT NOT NULL,
  formato TEXT NOT NULL DEFAULT 'narracao_imagens', proporcao TEXT DEFAULT '9:16', duracao_alvo INT DEFAULT 55,
  gancho TEXT, template_id INT REFERENCES crea_templates(id),
  roteiro TEXT NOT NULL, cta TEXT NOT NULL,
  validacao JSONB DEFAULT '{}',       -- resultado do motor de regras {bloqueios:[],alertas:[]}
  assets JSONB DEFAULT '[]',          -- [asset_id,...] em ordem de narração
  voz TEXT DEFAULT 'pt-BR-FranciscaNeural-Female', musica TEXT DEFAULT 'random',
  status TEXT NOT NULL DEFAULT 'rascunho',
  -- rascunho|roteiro_gerado|aguardando_revisao|aprovado|na_fila|renderizando|video_gerado|aguardando_revisao_final|publicado|vinculado|reprovado|erro_render
  reprovacao_motivo TEXT, versao INT DEFAULT 1, criativo_pai INT REFERENCES crea_criativos(id),
  video_arq TEXT, thumb_arq TEXT, duracao_real REAL,
  criado_por TEXT, aprovado_por TEXT, publicado_por TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(), atualizado_em TIMESTAMPTZ DEFAULT NOW());

-- fila de render (1 job por criativo aprovado; idempotente por criativo_uuid+versao)
CREATE TABLE crea_jobs (id SERIAL PRIMARY KEY, criativo_id INT REFERENCES crea_criativos(id),
  job_key TEXT UNIQUE NOT NULL,       -- "<uuid>:v<versao>" → worker nunca renderiza 2x
  payload JSONB NOT NULL, status TEXT DEFAULT 'pendente', -- pendente|pego|renderizando|concluido|erro
  progresso INT DEFAULT 0, log_resumo TEXT, tentativas INT DEFAULT 0,
  pego_em TIMESTAMPTZ, concluido_em TIMESTAMPTZ, criado_em TIMESTAMPTZ DEFAULT NOW());

-- vínculo com automação/régua
CREATE TABLE crea_vinculos (id SERIAL PRIMARY KEY, criativo_id INT REFERENCES crea_criativos(id),
  trilha TEXT NOT NULL, estagio_crm TEXT NOT NULL, dia_envio INT NOT NULL,
  condicao_entrada JSONB, condicao_bloqueio JSONB,  -- ex.: {"respondeu":true} não envia
  template_wati TEXT, mensagem TEXT, responsavel TEXT,
  dedup_regra TEXT DEFAULT 'sent-ledger-7d', janela_silencio TEXT DEFAULT '20:00-08:00',
  status TEXT DEFAULT 'ativo', criado_em TIMESTAMPTZ DEFAULT NOW());

-- métricas por criativo (alimentado por WATI webhook/CRM depois)
CREATE TABLE crea_metricas (criativo_id INT REFERENCES crea_criativos(id), dia DATE,
  envios INT DEFAULT 0, entregas INT DEFAULT 0, visualizacoes INT DEFAULT 0, respostas INT DEFAULT 0,
  cliques INT DEFAULT 0, reativados INT DEFAULT 0, propostas INT DEFAULT 0, vendas INT DEFAULT 0,
  receita NUMERIC DEFAULT 0, descadastros INT DEFAULT 0, bloqueios INT DEFAULT 0, PRIMARY KEY (criativo_id, dia));

-- trilha de auditoria (governança)
CREATE TABLE crea_log (id SERIAL PRIMARY KEY, entidade TEXT, entidade_id INT, acao TEXT,
  usuario TEXT, detalhe JSONB, criado_em TIMESTAMPTZ DEFAULT NOW());
```

Regras de governança no código: criativo `publicado`/`vinculado` **nunca é deletado** (só `arquivado`); editar roteiro aprovado → cria nova linha com `versao+1` e `criativo_pai`; toda transição de status grava em `crea_log`.

## 5. Endpoints

### Portal — UI (sessão, requireAuth)
| Rota | Quem | O quê |
|---|---|---|
| `GET /criativos` | admin, marketing | Wizard de pedido (8 seleções → roteiro do template → edição) |
| `POST /criativos` | admin, marketing | Cria criativo (status `roteiro_gerado`), roda motor de regras |
| `POST /criativos/:id/validar` | idem | Re-valida roteiro editado; bloqueios impedem avanço |
| `POST /criativos/:id/enviar-revisao` | idem | → `aguardando_revisao` |
| `POST /criativos/:id/aprovar` · `/reprovar` | **admin** | → `aprovado` (gera job) / `reprovado` (motivo obrigatório) |
| `GET /criativos/galeria` | logados | Galeria: filtros produto/problema/estágio/objetivo, preview, download |
| `POST /criativos/:id/aprovacao-final` | **admin** | vídeo_gerado → `publicado` |
| `POST /criativos/:id/duplicar` · `/nova-versao` | admin, marketing | Cópia editável |
| `POST /criativos/:id/vincular` | **admin** | Cria `crea_vinculos` → `vinculado` |
| `GET /criativos/:id/metricas` | admin | Desempenho consolidado |

### Portal — API pro worker da VPS (header `x-upload-key`)
| Rota | O quê |
|---|---|
| `GET /api/criativos/jobs/proximo` | Worker pega 1 job `pendente` (lock: status→`pego` + `pego_em`; jobs `pego` >30min voltam pra `pendente`) |
| `POST /api/criativos/jobs/:job_key/progresso` | `{status, progresso, log_resumo}` |
| `POST /api/criativos/jobs/:job_key/upload/:filename` | MP4 + thumb (streaming, octet-stream) |
| `POST /api/criativos/jobs/:job_key/concluir` | `{video_arq, thumb_arq, duracao_real}` → criativo `aguardando_revisao_final` |
| `POST /api/criativos/jobs/:job_key/erro` | `{erro}` → criativo `erro_render`; `tentativas+1` (máx 2) |
| `POST /api/criativos/assets/sync` | VPS envia catálogo de assets (path, tipo, produto, thumb) |

`callback_url` do PRD: implementado como esses endpoints de retorno (o "callback" é o worker chamando o portal — VPS não recebe conexão de fora).

## 6. Contrato do job (payload em `crea_jobs.payload`)

```json
{
  "job_key": "c7f3a9b2:v1",
  "creative_id": 42,
  "roteiro_final": "Você confia na água que chega...",
  "formato": "narracao_imagens",
  "proporcao": "9:16",
  "duracao_alvo": 55,
  "arquivos": [
    {"path": "curadoria-dura/t6_glass_....mp4", "ordem": 1},
    {"path": "assets-tdf/prontos/instalacao-9.png", "ordem": 2},
    {"path": "assets-tdf/prontos/card-cta.png", "ordem": 99}
  ],
  "pasta_assets": "~/MoneyPrinterTurbo",
  "narracao": {"voz": "pt-BR-FranciscaNeural-Female", "velocidade": 1.0},
  "musica": {"tipo": "random", "volume": 0.15},
  "legenda": {"fonte": "BeVietnamPro-Bold.ttf", "tamanho": 56, "posicao": "bottom"},
  "cta_visual": "assets-tdf/prontos/card-cta.png",
  "identidade": {"watermark": "assets-tdf/prontos/watermark.png", "posicao": "inferior-direito"},
  "retorno": {"progresso": "/api/criativos/jobs/{job_key}/progresso", "upload": "...", "concluir": "...", "erro": "..."}
}
```

**Worker na VPS** (`~/tdf-criativos-worker/worker.py`, systemd timer 60s):
1. `GET jobs/proximo` → se vazio, dorme
2. Se `job_key` já tem MP4 em `~/worker-out/` → pula render, vai direto pro upload (idempotência local)
3. Chama API local do MPT (`localhost:8082 POST /videos` com materiais locais) → acompanha `GET /tasks/{id}` → reporta progresso
4. Pós-processo: ffmpeg watermark → thumb (frame 2s)
5. Upload MP4+thumb → `concluir`. Erro em qualquer etapa → `erro` com log resumido.

## 7. Motor de regras (crea_regras — seed inicial)

| Código | Regra | Sev. | Detecção |
|---|---|---|---|
| R01 | Não prometer potabilidade só pelo equipamento | bloqueia | regex `potabilidade` sem `análise` no roteiro |
| R02 | Não afirmar solução sem análise da água (poço). **EXCEÇÃO oficial (15/07):** água de estação/concessionária com sintomas de dureza NÃO exige análise — Scale Stop/HyperScaleX resolve direto | bloqueia | produto poço + ausência de "análise"; escopo exclui água tratada+dureza |
| R03 | Proibido "elimina/remove 100%" | bloqueia | regex |
| R04 | Sem afirmação médica (cura, saúde garantida, doença) | bloqueia | regex lista médica |
| R05 | Filtro de entrada ≠ purificador de consumo | sinaliza | FE + regex `beber|potável direto` |
| R06 | Scale Stop/HyperScaleX NUNCA "amolece/água mole/remove cálcio" | bloqueia | regex, escopo scale-stop |
| R07 | Iron Free = água não tratada/poço, conforme análise | bloqueia | iron-free + regex `concessionária|rede` sem contexto negativo |
| R08 | Estação: obrigatório mencionar análise + vazão/consumo | bloqueia | escopo estacao, ausência dos termos |
| R09 | Água tratada × poço: template de trilhas distintas | bloqueia | validação estrutural (template.produto × problema) |
| R10 | Asset do produto = produto do roteiro | bloqueia | validação estrutural (asset.produto × criativo.produto) |
| R11 | 1 mensagem principal + 1 CTA | sinaliza | heurística: >1 ocorrência de padrão CTA |
| R12 | Foto real TDF tem prioridade sobre stock | sinaliza | % assets tipo foto_produto |
| R13 | Preço/garantia/telefone só via `crea_config` | bloqueia | regex `R\$|garantia de \d|\(\d{2}\) \d` no corpo (placeholders são permitidos) |

Motor roda em: criação, edição, aprovação (sempre). `bloqueia` → não avança; `sinaliza` → badge amarela pro revisor.

## 8. Biblioteca inicial — Trilha FERRO (7 templates)

Sequência pro lead de poço com ferro (estágios CRM mapeados):
1. **Diagnóstico** (lead novo) — espelho de sintomas: roupa amarelada, mancha, piscina ferrugem
2. **Explicação** (em qualificação) — por que o ferro invisível oxida e mancha; ferver não resolve
3. **Implicação** (sem resposta, D+3) — acúmulo em tubulação/equipamentos; custo silencioso *(regras: implicação aprovada; galão NUNCA)*
4. **Solução** (aguardando análise / análise recebida) — tratamento dimensionado por vazão+análise (Iron Free, sem preço — R13)
5. **Prova social** (apresentação/proposta) — instalações reais, "mais um poço resolvido na região"
6. **Quebra de objeção** (proposta parada) — "ferver resolve?" / "qualquer filtro serve?" mito×verdade
7. **Reativação** (fechado perdido >30d) — "sua água continua a mesma?" porta aberta firme

Cada template com corpo já escrito nas regras oficiais + gancho da biblioteca dos 50 hooks + `{{placeholders}}` + assets recomendados (curadoria ferro + fotos Iron Free) — entra como seed SQL na Fase 1, status `rascunho` até Paulo aprovar 1 a 1 no portal.

## 9. Riscos técnicos

| # | Risco | Mitigação |
|---|---|---|
| R1 | VPS 2 cores = fila anda ~7 vídeos/h no máx | Fila com posição visível; escalar Hetzner (CX32) se demanda >20/dia |
| R2 | Render trava/OOM (3.7GB) | Worker com timeout 20min + swap 2GB + tentativas máx 2 → `erro_render` |
| R3 | server.js monolito crescendo | Módulo em `lib/criativos.js` + `views/criativos/`, só rotas no server.js |
| R4 | Sessão em memória (deploy derruba login) | Já é assim hoje; aceito (re-login) |
| R5 | WATI quality rating (template MKT em massa) | Piloto 50 leads/trilha; monitorar quality; dedup sent-ledger 7d; janela silêncio |
| R6 | Drive FOTOS bloqueado pra sync | Espelho manual atual funciona; sync automático quando Paulo liberar link |
| R7 | Voz Edge TTS pode mudar/degradar (serviço grátis) | Config `voz` por criativo; fallback ElevenLabs (chave existe) plugável |
| R8 | Claims errados passarem pelo regex | Motor é rede de segurança, NÃO substitui aprovação humana (status `aguardando_revisao` obrigatório) |
| R9 | Idempotência de upload (vídeo duplicado no volume) | `job_key` único + upload sobrescreve mesmo arquivo |
| R10 | Núbia OFF ≠ automação de envio OFF | Envio da régua via motor tdf-ops follow-ups (já existe), NUNCA pela Núbia; respeitar travas vigentes |

## 10. Plano de implementação por fases

| Fase | Entrega | Esforço | Critério de aceite |
|---|---|---|---|
| **F1 — Fundação** | Tabelas + seeds (dims do PRD, config central, 13 regras, 7 templates FERRO rascunho) + motor de regras + `lib/criativos.js` | 1 dia | `POST /criativos` valida e bloqueia roteiro com claim proibido |
| **F2 — Wizard + Revisão** | Tela pedido (8 passos), edição de roteiro com validação live, fluxo aprovar/reprovar, log/versionamento | 1-2 dias | Paulo cria pedido FERRO/implicação e aprova pelo portal |
| **F3 — Fila + Worker** | Endpoints de job + worker VPS (systemd) + MPT API :8082 + watermark + upload de volta | 1-2 dias | Criativo aprovado vira MP4 na galeria sem SSH manual |
| **F4 — Galeria + Publicação** | Galeria com filtros, aprovação final, duplicar/nova versão, download | 1 dia | 4 vídeos NUTRI-FE de hoje importados como criativos publicados |
| **F5 — Vínculo com automação** | `crea_vinculos` + integração motor follow-ups tdf-ops + template WATI + stop-on-reply → closer | 2-3 dias | Trilha FERRO piloto com 50 leads reais |
| **F6 — Métricas** | Webhook WATI → `crea_metricas` + painel de desempenho + índice de qualidade | 2 dias | Métricas de envio/resposta visíveis por criativo |

Total estimado: **~8-10 dias úteis** de implementação, com entregas usáveis a cada fase.

### Dependências externas (do Paulo)
1. Link público das pastas FOTOS/VIDEOS do Drive (R6)
2. Re-assinatura Z-API (avisos internos)
3. Aprovação Meta dos templates `ia_nutri_` com vídeo (F5)
4. Aprovação 1-a-1 dos 7 templates FERRO no portal (F2)
