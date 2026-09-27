# Trilhas Dinâmicas e Personalizadas — Proposta de Arquitetura

**Portal do Colaborador · Tudo de Filtro — v1 para validação (15/07/2026)**
Regra combinada: **nenhum código antes da validação desta arquitetura.**

---

## 1. Lógica de composição

A jornada de um colaborador **nunca é uma trilha fixa**. É o resultado de uma função de composição executada sobre o perfil dele:

```
JORNADA(colaborador) =
  dedup( ordenar(
    blocos(institucional)
    ∪ blocos(cargo)
    ∪ blocos(produto × linha)
    ∪ blocos(squad)
    ∪ blocos(nível)
    ∪ blocos(liderança, se aplicável)
    ∪ blocos(compliance obrigatório)
    ∪ blocos(atribuídos pelo gestor)
    ∪ blocos(disparados por evento: reforço, reciclagem)
  ))
```

Princípios:

1. **Bloco, não combinação.** O catálogo tem BLOCOS reutilizáveis ("Qualificação BANT", "Ferro e Manganês", "CRM para closer"). Um bloco pertence a N trilhas; a trilha é só uma lista ordenada de blocos com metadados (obrigatoriedade, prazo, estágio). Proibido criar "Trilha SDR-Bebedouro": ela EMERGE de `institucional + cargo:SDR + produto:bebedouros`.
2. **Dedup por módulo com união de exigências.** Se "CRM básico" aparece na trilha do cargo (nota mín. 70) e na do squad (nota mín. 80), o colaborador vê o módulo UMA vez, com a exigência mais forte (80) e com as duas origens visíveis — é assim que respondemos "por que preciso aprender": *"Este módulo faz parte de: Formação SDR · Squad Água Não Tratada"*.
3. **Ordem = estágio → ordem interna → pré-requisitos.** Os 9 estágios canônicos (Documentação → Onboarding institucional → Formação do cargo → Formação por produto → Prática/roleplay → Prova → Aprovação → Liberação operacional → Academia avançada) são o eixo visual. Dentro do estágio, ordem definida na trilha; por cima de tudo, o grafo de pré-requisitos (ordenação topológica; ciclo = erro de cadastro apontado no admin).
4. **Composição é recalculável e explicável.** Mudou o perfil (trocou de squad, virou supervisor), recalcula. Módulo concluído nunca é perdido — progresso pertence ao MÓDULO, não à trilha. Cada item da jornada guarda `origem[]` (quais regras/trilhas o colocaram lá).
5. **Escada de carreira (regra do Paulo).** Todo vendedor passa pela TRILHA SDR (cargo) + trilha do produto, obrigatoriamente. Quem é closer recebe a trilha de closer JÁ ATRIBUÍDA porém BLOQUEADA — ela desbloqueia sozinha no instante em que a trilha SDR é concluída (pré-requisito entre trilhas, `path_prerequisites`). O closer novo vê o caminho inteiro desde o dia 1: "SDR primeiro, closer libera em seguida".
6. **Prazo**: cada atribuição de trilha carrega prazo (dias corridos a partir da atribuição ou da data de entrada); módulos podem ter prazo próprio. O prazo exibido é o mais apertado.

---

## 2. Modelagem de banco (Postgres — padrão do portal)

Segue o padrão já existente em `lib/bi-estoque-db.js`: Postgres via pool do server.js, `ensureTables()` idempotente, IDs textuais prefixados gerados no JS (`mod_`, `lp_`, `rule_`, `perm_`...), colunas JSONB para estruturas flexíveis. O progresso das academias atuais (kv_store `progressPrefix`) **não é migrado à força**: um adapter lê o kv_store e materializa conclusões em `user_module_progress` (ver §12, Fase 1).

```
-- Perfil (novo — hoje USERS é hardcoded no server.js)
collaborators           id (col_), username FK->USERS, nome, foto, cargo, departamento,
                        unidade, squad, produtos JSONB, linha_produto JSONB, nivel,
                        modalidade_contratacao, responsabilidades JSONB, gestor_username,
                        data_entrada, ativo, criado_em, atualizado_em

-- Catálogo
modules                 id (mod_), titulo, descricao, tipo (teorico|pratico|avaliacao|roleplay|
                        certificacao|documentacao), conteudo_ref (rota/academia/arquivo),
                        carga_min, tipo_conclusao (auto|nota|aprovacao|roleplay|upload),
                        nota_minima, max_tentativas, validade_meses (p/ reciclagem), ativo
module_prerequisites    module_id, requires_module_id, nota_minima_override,
                        requer_aprovacao bool          -- PK composta; grafo acíclico validado
learning_paths          id (lp_), nome, path_type, descricao, prazo_dias_default, ativo
path_prerequisites      path_id, requires_path_id     -- escada de carreira: closer exige SDR concluída
path_types              id, nome (institucional|cargo|produto|linha_produto|squad|nivel|
                        lideranca|compliance|reciclagem|reforco|manual)
path_modules            path_id, module_id, estagio (1..9), ordem, obrigatorio bool,
                        prazo_dias_offset, nota_minima_override

-- Motor de regras (cadastrável, NUNCA hardcoded)
path_rules              id (rule_), nome, descricao, prioridade, ativo,
                        gatilho (perfil_criado|perfil_alterado|nota_abaixo_min|
                                 certificacao_vencendo|manual|diario),
                        condicao JSONB     -- ex.: {"all":[{"campo":"cargo","op":"=","valor":"SDR"},
                                           --        {"campo":"produtos","op":"contains","valor":"bebedouros"}]}
                        acao JSONB         -- ex.: {"atribuir_paths":["lp_sdr","lp_acad_beb"],
                                           --        "prazo_dias":30, "modulos_extras":[...]}
                        criado_por, versao, atualizado_em

-- Atribuição e progresso
path_assignments        id (pas_), collaborator_id, path_id, origem (rule_id|manual|evento),
                        atribuido_por, prazo_final, status (ativa|concluida|expirada|suspensa)
user_module_progress    id (ump_), collaborator_id, module_id, status (bloqueado|disponivel|
                        em_andamento|aguardando_aprovacao|concluido|reprovado),
                        melhor_nota, tentativas, origem JSONB (paths/regras que exigiram),
                        prazo, iniciado_em, concluido_em, fonte (portal|kv_store_legacy)
assessments             id (ass_), module_id, tipo (prova|quiz), config JSONB (questões ref,
                        nota_minima, tempo)
assessment_attempts     id, assessment_id, collaborator_id, nota, respostas JSONB, em
roleplays               id (rp_), module_id, cenario_ref, avaliador_papel (gestor|supervisor)
roleplay_evaluations    id, roleplay_id, collaborator_id, avaliador, nota, rubrica JSONB,
                        feedback, resultado (aprovado|reprovado), em
certifications          id (cert_), collaborator_id, module_id/path_id, emitida_em,
                        valida_ate, arquivo_pdf, status (valida|vencendo|vencida)

-- Permissões operacionais
operational_permissions id (perm_), chave (crm.acessar|leads.receber|propostas.enviar|
                        produto.poco.atender|descontos.aplicar|...), nome, descricao,
                        escopo (portal|robôs|zoho-manual)
permission_requirements permission_id, requisito JSONB
                        -- {"modulos":["mod_x"],"nota_min":80,"roleplay":"rp_y",
                        --  "certificacao":"cert_z","aprovacao_manual":true}
user_permissions        collaborator_id, permission_id, status (bloqueada|pendente_aprovacao|
                        liberada|suspensa), liberada_por (auto|username), em, justificativa

-- Governança
manager_approvals       id (apr_), tipo (roleplay|liberacao|modulo|reabertura),
                        collaborator_id, ref_id, solicitado_em, decidido_por, decisao
                        (aprovado|reprovado), justificativa, decidido_em
learning_deadlines      collaborator_id, ref (path|module), ref_id, prazo, notificado_em
audit_log               id, quem, acao, entidade, ref_id, antes JSONB, depois JSONB, em
```

---

## 3. Motor de regras

- **Formato**: `condicao` em JSONB com `all`/`any` aninhados, operadores `=`, `!=`, `in`, `contains`, `>=`, `vencendo_em_dias`. `acao` declara: atribuir trilhas, atribuir módulos avulsos, prazo, notificar gestor.
- **Gatilhos** (event-driven, não polling cego):
  1. `perfil_criado` / `perfil_alterado` (admissão, troca de squad/cargo);
  2. `nota_abaixo_min` (tentativa de prova reprovada → regra pode atribuir trilha de reforço);
  3. `certificacao_vencendo` (job diário varre `certifications.valida_ate` → trilha de reciclagem);
  4. `manual` (gestor no painel);
  5. `diario` (reavaliação de segurança pra pegar retro-ajustes).
- **Determinístico e idempotente**: rodar 2x não duplica (atribuição tem chave única colaborador+path+origem ativa).
- **Prioridade e conflito**: regras têm `prioridade`; exigências somam-se (união), nunca se subtraem — remover módulo de alguém é sempre ação manual do gestor com auditoria.
- **Admin**: CRUD de regras com **simulador (dry-run)**: seleciona um colaborador (ou perfil fictício) e vê a jornada que sairia, ANTES de ativar a regra. Toda edição versiona (`versao`, `audit_log`).
- Exemplos do pedido viram linhas de `path_rules` — zero código novo por regra.

## 4. Fluxo de atribuição

```
Evento (admissão/alteração/nota/vencimento/manual)
  → seleciona regras ativas do gatilho, ordena por prioridade
  → avalia condicao contra o perfil (collaborators + certifications + progresso)
  → cria path_assignments faltantes (idempotente) com prazo
  → COMPOSITOR: expande path_modules de todas as assignments ativas
      → dedup por module_id (une origens, pega exigência mais forte)
      → resolve grafo de pré-requisitos (topological sort)
      → grava/atualiza user_module_progress (status inicial: bloqueado|disponivel)
  → notifica: colaborador (nova etapa/prazo) e gestor (novas pendências dele)
```

## 5. Fluxo de desbloqueio

Estados do módulo: `bloqueado → disponivel → em_andamento → (aguardando_aprovacao) → concluido | reprovado`.

- `bloqueado → disponivel`: todos os `module_prerequisites` concluídos com nota ≥ exigida **e** aprovações exigidas dadas.
- Conclusão por tipo: `auto` (leu/assistiu), `nota` (assessment ≥ nota mínima; tentativas ≤ max, esgotou → `reprovado` + gatilho `nota_abaixo_min`), `roleplay` (avaliação registrada como aprovada), `aprovacao` (gestor decide), `upload` (documentação, com aceite).
- Cada desbloqueio reavalia em cascata os módulos dependentes **e** a matriz de permissões (§7).
- Colaborador nunca vê "porta fechada sem placa": módulo bloqueado exibe o que falta ("Conclua *Processo Comercial* com nota ≥ 80").

## 6. Fluxo de aprovação

- Tudo que exige humano vira item em `manager_approvals`, roteado pro `gestor_username` do colaborador (fallback: admin).
- Tipos: avaliação de roleplay (com rubrica), liberação operacional, conclusão manual de módulo, reabertura de trilha, suspensão de permissão.
- **Reprovar exige justificativa** (campo obrigatório) → vira feedback visível pro colaborador + pode disparar regra de reforço.
- SLA de aprovação: pendência >48h aparece em vermelho no painel do gestor e no briefing diário do gestor (integração com o robô já existente).
- Tudo em `audit_log` (quem, quando, o quê, justificativa).

## 7. Matriz de permissões operacionais

| Permissão (chave) | Requisitos típicos | Liberação | Enforcement |
|---|---|---|---|
| `crm.acessar` | módulo Processo Comercial | automática | portal (menu/rotas) |
| `leads.visualizar` | trilha institucional completa | automática | portal |
| `leads.receber` | formação do cargo + roleplay + **aprovação do supervisor** | dependente de aprovação | **robôs** (rede de segurança, distribuição, lead score não atribuem a quem não tem) |
| `oportunidades.movimentar` | CRM para o cargo | automática | portal + auditoria diária |
| `propostas.criar/enviar` | módulo de propostas (nota ≥ 80) | automática por nota | portal + auditoria CRM |
| `descontos.aplicar` | negociação + aprovação gestor | manual | processo + auditoria |
| `produto.poco.atender` | trilha técnica poço + roleplay técnico + **aprovação técnica** | roleplay + aprovação | robôs de roteamento por produto |
| `analise.solicitar` / `solucao.aprovar` | módulos técnicos | nota/aprovação | portal |
| `clientes.atender_sozinho` | prova + aprovação comercial | manual | processo |
| `academia.avancada` | trilha inicial 100% | automática | portal |

Cada liberação pode ser: **automática · manual · por aprovação · por nota · por roleplay · por certificação** — é exatamente o `requisito JSONB` de `permission_requirements`. Suspensão pelo gestor derruba o status na hora (com justificativa + auditoria). **Honestidade técnica**: enforcement é garantido no PORTAL e nos NOSSOS robôs (que decidem quem recebe lead/produto); dentro do Zoho nativo (perfis/territórios) a liberação é espelhada por processo/manual na Fase 1 — automatizar isso no Zoho é evolução, não pré-requisito.

## 8. Wireframe textual — "Minha Jornada"

```
┌──────────────────────────────────────────────────────────────────┐
│ [foto]  Nicole G. · SDR · Squad Bebedouros · Gestor: Paulo       │
│ Início: 08/07/2026 · Produtos: Bebedouros                        │
│ ████████████░░░░░░ 62% concluído · Prazo geral: 08/08 (23 dias)  │
├──────────────────────────────────────────────────────────────────┤
│ 🎯 VOCÊ ESTÁ AQUI: Etapa 4 — Formação por Produto                │
│ "Finalize os 3 módulos restantes de Bebedouros, tire nota ≥80%   │
│  na prova e faça o roleplay com seu supervisor. Depois da        │
│  aprovação, você começa a RECEBER LEADS de bebedouro."           │
│ ▶ Próximo passo: [Refil Acquabios Multi — 25 min]   Prazo: 18/07 │
├──────────────────────────────────────────────────────────────────┤
│ Etapa 1 Documentação        ✅ 100%                              │
│ Etapa 2 Institucional       ✅ 100% (LGPD ✅ · Conduta ✅)        │
│ Etapa 3 Formação do cargo   ✅ 100% (certificado SDR 🏅)         │
│ Etapa 4 Formação produto    🔵 4/7 — em andamento                │
│   ✅ Tipos de bebedouro   ✅ Capacidade   ✅ Compressor           │
│   ✅ Ventoinha  🔵 Refil (em andamento)  ⬜ ICP  ⬜ Objeções      │
│      └ por quê: Trilha SDR + Squad Bebedouros                    │
│ Etapa 5 Roleplay            🔒 (libera ao concluir Etapa 4)      │
│ Etapa 6 Prova               🔒 nota mínima 80% · 3 tentativas    │
│ Etapa 7 Aprovação           🔒 aprovador: supervisor             │
│ Etapa 8 Liberação           🔒 → desbloqueia: receber leads      │
│ Etapa 9 Academia avançada   🔒                                   │
├──────────────────────────────────────────────────────────────────┤
│ 🔓 Liberado: portal, CRM (leitura), biblioteca                   │
│ 🔒 Bloqueado: receber leads · enviar propostas (ver requisitos)  │
│ ⏳ Pendências: 0 avaliações · 0 aprovações                        │
└──────────────────────────────────────────────────────────────────┘
```

### 8.1 Modo "Você é novo? Comece por aqui" (visão do Paulo — norte do produto)

**REGRA DE OURO DA EXPERIÊNCIA (Paulo, 15/07): liberar aos poucos, mas SEMPRE com um único "comece por aqui" aceso.**
Em qualquer momento da jornada, o colaborador tem exatamente UM próximo passo em destaque — nunca uma prateleira de opções. O resto existe na tela (visível, com cadeado e o motivo), mas só UMA porta está aberta. Isso vale do primeiro dia ao último nível:
- Dia 1: um botão só — "Comece por aqui: Documentação".
- Meio da trilha: "Continue aqui: [módulo atual]" — o botão muda sozinho conforme conclui.
- **Roleplay**: bloqueado até os módulos teóricos da etapa + nota mínima; quando abre, ELE vira o "continue aqui".
- **Prova**: bloqueada até o roleplay aprovado.
- **Academia especial/avançada**: é a recompensa final — só abre com a trilha inicial 100% + certificação; aparece desde o dia 1 como cadeado dourado ("seu próximo nível"), pra dar direção e vontade, nunca como opção precoce que dispersa.
- Liberações operacionais (receber leads, enviar proposta, atender produto) seguem o mesmo ritmo: cada conquista destrava a próxima porta, e o portal sempre diz qual é.


O problema real: colaborador novo entra e o portal tem 30 cards — ele não sabe onde começar. A solução é **inversão da home**:

- **Enquanto o onboarding não termina (Etapas 1–3), a home do novato É a "Minha Jornada"** — um único botão gigante: "▶ Continuar de onde parei". Todos os demais cards do portal aparecem acinzentados com cadeado e a frase "libera ao concluir sua formação" — visíveis (dão vontade), mas não clicáveis.
- **Aptidão por produto = certificado + permissão.** Concluir a formação de um produto (módulos + prova ≥ nota + roleplay + aprovação do gestor) emite o **Certificado de Aptidão daquele produto** (PDF, com validade) e liga a permissão `produto.X.atender` / `leads.receber` daquele produto. Sem aptidão, o robô de distribuição simplesmente não entrega lead daquele produto pra ele — a exigência não é aviso, é trava.
- **O primeiro login guia**: "Bem-vindo, [nome]! Você é novo por aqui — sua formação tem 9 etapas e leva ~3 semanas. Comece por: [Documentação]." Nada de caça ao tesouro.
- Colaborador antigo não sofre regressão: quem já tem certificado das academias atuais entra com as aptidões correspondentes reconhecidas (adapter kv_store).

## 9. Wireframe textual — Painel do Gestor

```
┌ Meu time (8) ─────────── filtros: [squad ▾] [trilha ▾] [status ▾] ┐
│ ⚠️ ATENÇÃO AGORA: 2 aprovações paradas >48h · 1 certificação      │
│    vencendo (Cátia: Poço, 12 dias) · 1 sem atividade há 5 dias    │
├───────────────────────────────────────────────────────────────────┤
│ Nome      Trilha ativa      Progresso  Prazo   Últ.ativ  Ação     │
│ Nicole    SDR+Bebedouros    ██62%      18/07   hoje      [ver]    │
│ Danúbia   SDR+Estação       ██14% 🔴   atrasa  3 dias    [1:1]    │
│ Evandra   SDR+Estação       ██21% 🔴   atrasa  ontem     [1:1]    │
│ Lucas     Reforço: descarte ██40%      20/07   hoje      [ver]    │
├─ Pendentes de mim ────────────────────────────────────────────────┤
│ • Roleplay Bebedouros — Nicole            [avaliar rubrica]       │
│ • Liberação "receber leads" — Nicole      [aprovar] [reprovar+jus]│
├─ Métricas do squad ───────────────────────────────────────────────┤
│ Tempo médio de conclusão: 21d · Reprovações 30d: 3 · Roleplays    │
│ pendentes: 1 · Permissões suspensas: 0                            │
├─ Ações ───────────────────────────────────────────────────────────┤
│ [+ módulo p/ alguém] [definir prazo] [reciclagem] [reabrir trilha]│
│ [suspender permissão] [inserir feedback]                          │
└───────────────────────────────────────────────────────────────────┘
```

## 10. Exemplos de composição (provando que não há trilha fixa)

- **SDR de Bebedouros** = `institucional` + `cargo:SDR` (Função, Qualificação, BANT, SPIN, Cadência, CRM, Transferência) + `produto:bebedouros` (Academia 21 módulos, ICP, script, objeções) + prática (roleplay → prova → aprovação do gestor → permissão `leads.receber`).
- **Qualificação própria do Bebedouro (bloco novo, definido pelo Paulo).** Bebedouro é ciclo RÁPIDO e as perguntas são mais simples que SPIN de poço. O bloco "Qualificação Rápida de Bebedouro" ensina exatamente esta sequência: (1) **Status da compra**: já está APROVADA ou em fase de COTAÇÃO? (muda tudo: aprovada = fechar agora, cotação = disputa de preço/prazo); (2) **Motivo real**: o que fez buscar o bebedouro AGORA? (quebrou o antigo? obra nova? fiscalização? equipe cresceu?) — é o termômetro de urgência; (3) **Licitação é fluxo à parte**: identificar cedo; licitação demora mais — vai pra cadência própria de longo prazo com follow-up de edital, NUNCA descartada por "demora" nem cobrada como venda rápida; (4) **PF ou PJ** (define proposta, faturamento e argumento); (5) **Decisor**: quem aprova a compra; (6) **Prazo**; (7) **Proposta na primeira conversa**: qualificou = passa proposta na hora — no bebedouro velocidade é conversão. A prova e o roleplay dessa trilha avaliam ESSA sequência, não SPIN completo.
- **Closer de Filtro de Entrada** = `institucional` + `cargo:closer` (Processo comercial, CRM closer, Proposta, Negociação) + `produto:filtro_entrada` (Diagnóstico, Vazão/Pressão, Light/Filtrali/American, By-pass, Instalação) + roleplay + prova + aprovação → `propostas.enviar`, `leads.receber`.
- **Closer de Poço/Iron Free** = `institucional` + `cargo:closer` + `squad:agua_nao_tratada` (Análise de água, Ferro, Manganês, Turbidez, Orgânicos, Cloração) + `produto:iron_free` (Bomba, Retrolavagem, Dimensionamento, Proposta técnica) + roleplay técnico + prova técnica + **aprovação técnica E comercial** → `produto.poco.atender`.
- **Supervisor Comercial** = `institucional` + trilhas dos produtos do squad + `lideranca` (Indicadores, Conversão, Forecast, Auditoria de CRM, Gestão de rotina, Feedback, Cobrança, Desenvolvimento) + roleplay como avaliador → permissões `roleplay.avaliar`, `liberacao.aprovar`.
- Módulo compartilhado (ex.: "CRM básico" no cargo e no squad) aparece 1x com 2 origens — dedup demonstrado.

## 11. Riscos técnicos

1. **USERS hardcoded no server.js** — hoje não existe perfil estruturado (squad/produto/nível). Mitigação: tabela `collaborators` vira fonte da verdade; USERS continua só para autenticação na Fase 1.
2. **Progresso legado no kv_store** (academias atuais) — migração forçada quebraria certificados existentes. Mitigação: adapter read-only + materialização incremental (`fonte='kv_store_legacy'`).
3. **Enforcement fora do portal** (Zoho nativo) — permissão "receber leads" só é dura porque NOSSOS robôs distribuem; dentro do Zoho puro alguém pode burlar. Mitigação: robôs respeitam `user_permissions` + auditoria diária aponta violações; espelhamento Zoho fica pra fase posterior.
4. **Regras mal cadastradas** (condição vazia atribuindo tudo a todos; ciclos de pré-requisito). Mitigação: dry-run obrigatório, validação de grafo no save, versão + rollback.
5. **Explosão de recálculo** (regra `diario` sobre todos). Mitigação: recálculo incremental por evento; job diário só reconcilia divergências.
6. **Prazos e cobrança viram ruído** se tudo for obrigatório com prazo curto. Mitigação: prazo default por trilha, relatório de carga no dry-run ("essa regra adiciona 22h de conteúdo").
7. **Aprovação-gargalo** (gestor não avalia roleplay → trilha trava). Mitigação: SLA 48h com escalonamento pro briefing diário do gestor.
8. **Postgres é o ponto único** — backup: já é gerenciado no Railway; adicionar dump semanal pro volume.

## 12. Plano de implementação por etapas

- **Fase 0 — Validação (esta entrega).** Aprovar arquitetura, matriz de permissões e os 9 estágios. *Critério: seu OK, item a item.*
- **Fase 1 — Fundação (dados).** `ensureTables` das entidades; tela admin de Colaboradores (perfil completo); importar USERS; adapter kv_store→progresso. *1ª visão "Minha Jornada" somente-leitura com dados reais das academias atuais.*
- **Fase 2 — Catálogo e composição.** Cadastro de módulos/trilhas/blocos; compositor com dedup+topological sort; "Minha Jornada" completa com bloqueios e "por quê".
- **Fase 3 — Motor de regras + atribuição.** CRUD de regras com dry-run; gatilhos de perfil; regras dos 4 exemplos (SDR, closer FE, closer poço, supervisor) cadastradas EM DADOS.
- **Fase 4 — Avaliações, roleplay e aprovações.** Integrar provas existentes ao `assessments`; fila do gestor; justificativa obrigatória; reforço automático por nota.
- **Fase 5 — Permissões operacionais.** Matriz + enforcement no portal e nos robôs de distribuição; painel do gestor completo; certificações com validade + reciclagem automática.
- Cada fase entra atrás de flag, testada com 1 squad piloto (sugestão: Bebedouros) antes do time todo.

## 13. Critérios de aceite

1. Colaborador novo cadastrado com cargo+produto recebe jornada composta automaticamente, sem trilha manual, em <1 min.
2. Nenhum módulo duplicado na jornada; módulo compartilhado exibe todas as origens.
3. Módulo bloqueado sempre exibe o motivo e o que falta (regra, nota, aprovação, prazo).
4. Reprovação abaixo da nota mínima com tentativas esgotadas gera trilha de reforço automaticamente (regra em dados, não código).
5. Certificação a X dias do vencimento gera trilha de reciclagem e aviso ao gestor.
6. Permissão `leads.receber` só ativa após: trilha do cargo concluída + roleplay aprovado + aprovação manual — e os robôs de distribuição PARAM de atribuir leads a quem não a tem.
7. Gestor consegue: atribuir módulo, definir prazo, aprovar/reprovar com justificativa, suspender permissão, reabrir trilha — tudo com trilha de auditoria.
8. Editar uma regra no admin muda jornadas futuras sem deploy; dry-run mostra o efeito antes.
9. Progresso das academias atuais aparece na jornada sem retrabalho do colaborador.
10. Closer novo enxerga a trilha de closer no dia 1 como BLOQUEADA e ela desbloqueia automaticamente ao concluir a trilha SDR (sem ação manual).
11. Troca de squad/cargo recompõe a jornada preservando tudo que já foi concluído.

## 14. Testes necessários

- **Unitários do compositor**: dedup com exigências conflitantes; topological sort; ciclo detectado; união de origens; prazo mais apertado vence.
- **Unitários do motor de regras**: operadores todos; `all`/`any` aninhados; idempotência (2 execuções = 1 atribuição); prioridade.
- **Integração**: admissão → jornada; troca de perfil → recomposição sem perda; nota baixa → reforço; vencimento → reciclagem; aprovação → desbloqueio em cascata → permissão liberada; suspensão → robô de leads deixa de atribuir (teste com deal real no Sandbox).
- **Migração**: progresso kv_store das 4 academias refletido corretamente pra todos os usernames atuais.
- **UI**: jornada renderiza os 9 estágios com os 3 perfis exemplo; painel do gestor com pendências e SLA; acessível no celular.
- **Carga**: recálculo de 30 colaboradores × 80 módulos < 2s; regra `diario` não duplica nada.
- **Auditoria**: toda decisão de gestor consultável (quem/quando/justificativa).

---
*Documento para validação. Nada será programado antes do seu OK — e o OK pode ser parcial (ex.: aprovar Fases 1-2 e segurar permissões).*
