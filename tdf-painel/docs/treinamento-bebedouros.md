# Treinamento de Vendas — Bebedouros Industriais

Módulo do **Portal do Vendedor** (não é projeto separado). Academia de vendas para SDRs, closers, supervisores e novos vendedores da Tudo de Filtro venderem bebedouros industriais com método consultivo.

Acesso: menu **Treinamento → Bebedouros Industriais** ou `/treinamento/bebedouros`.

---

## 1. Como foi integrado (arquitetura)

Respeitando o stack existente do portal (**Express + EJS + express-session + Postgres**), sem migrar tecnologia:

| Peça | Caminho | O que é |
|---|---|---|
| Motor (router) | `lib/treinamento-bebedouros.js` | Router Express isolado. Montado com **1 linha** em `server.js` (`app.use('/treinamento/bebedouros', ...)`), antes do catch-all `/treinamento/:module`. |
| Dados de produto | `data/treinamento-bebedouros/produtos.js` | Specs dos 5 modelos (fonte marcada: site / empresa / pendente). |
| Preços (config) | `data/treinamento-bebedouros/precos.js` | Preços de bebedouro + oferta de upsell. **Nenhum preço fica em componente.** |
| Índice de módulos | `data/treinamento-bebedouros/modulos.js` | Ordem, nav e metadados dos 21 módulos. |
| Conteúdo dos módulos | `data/treinamento-bebedouros/content/mod-XX-*.js` | 21 arquivos, um por módulo (blocos ricos). |
| Anatomia interativa | `data/treinamento-bebedouros/anatomia.js` | Hotspots clicáveis do equipamento. |
| Roleplays | `data/treinamento-bebedouros/roleplays.js` | 8 cenários interativos com pontuação. |
| Banco de questões | `data/treinamento-bebedouros/banco-questoes.js` | 70 questões (a prova sorteia 30). |
| Views | `views/treinamento/bebedouros/*.ejs` | Hub, módulo, prova, roleplay, certificado, gestor + parciais `_shared/_blocos/_componentes`. |
| Menu | `views/sidebar.ejs` | Item "Bebedouros Industriais" na seção Treinamento. |
| Imagens | `public/img/treinamento-bebedouros/` | Fotos reais dos produtos. |

**Persistência:** progresso do aluno gravado na camada **`kv_store`** já existente do portal (Postgres + cache), chave `treinbeb:progress:<username>`. Sobrevive a redeploy. Nada de tabela nova nem migração.

**Nenhuma área existente do portal foi alterada** além de: 2 linhas em `server.js` (mount) e 1 linha na sidebar. Backup feito por commit antes de tudo.

---

## 2. Funcionalidades entregues

- **Hub** com capa, carga horária, % concluído, nota média, status de prova/certificação, "Continuar", "Revisar", histórico de atividades.
- **21 módulos** navegáveis, progresso salvo (sai e volta de onde parou), verificação rápida por módulo, exercício (salvo no navegador), resumo, slot de vídeo pronto para o Higgsfield.
- **Ferramentas interativas:** anatomia clicável, comparador de modelos, **calculadora de dimensionamento responsável** (usa o pico, alerta sobre dados faltantes, nunca dá regra linear), **formulário BANT-DP** com score 0–12, **simulador de upsell** (com registro apresentado/aceito/recusado), **checklist de CRM**.
- **Prova do closer:** 30 questões sorteadas de 70, questões e alternativas embaralhadas, correção **server-side**, nota mínima 80%, registra tentativas e aponta áreas de erro.
- **8 roleplays** com falas do cliente, opções de resposta, feedback (por quê / risco / como melhorar) e pontuação.
- **Certificado** "Closer Certificado em Bebedouros Industriais" liberado só com 100% dos módulos + prova ≥80% + roleplays obrigatórios; **PDF** gerado via PDFKit.
- **Painel do gestor** (restrito a gestor/CEO): progresso por vendedor, notas, prova, roleplays, upsell, certificados e áreas de maior erro. Filtro por nome.

---

## 3. Como ATUALIZAR (sem programar)

- **Preço de bebedouro ou do refil:** editar só `data/treinamento-bebedouros/precos.js`.
- **Specs de um modelo:** editar `data/treinamento-bebedouros/produtos.js`.
- **Texto de um módulo:** editar `data/treinamento-bebedouros/content/mod-XX-*.js` (siga o formato de blocos documentado no topo do `mod-01-intro.js`).
- **Adicionar/remover módulo:** editar `data/treinamento-bebedouros/modulos.js` e criar o `content/` correspondente.
- **Questões da prova:** editar `data/treinamento-bebedouros/banco-questoes.js` (`correta` = índice 0-based da alternativa certa).
- **Roleplays:** editar `data/treinamento-bebedouros/roleplays.js`.
- Depois de editar, rode `node -c <arquivo>` para conferir a sintaxe. Deploy normal do portal.

### Adicionar vídeos (Higgsfield) depois
Cada módulo já tem o campo `video: { url, thumb, duracaoSeg, transcricao, legenda }` (hoje vazio). Basta preencher `url` (e opcionalmente `thumb`/`legenda`) no `content/mod-XX-*.js` — o player aparece automaticamente no topo do módulo. Vídeos sugeridos: o que é um bebedouro, como funciona o compressor/ventoinha, diferença entre modelos, simulações de qualificação/rapport/objeção/fechamento/upsell, identificar revendedor de licitação.

---

## 4. Pendências de validação técnica (NÃO publicar como definitivo)

Extraído do site em 02/jul/2026. As dimensões misturam metro e centímetro. **Não corrigir por conta própria** — confirmar com a fábrica. Na plataforma aparecem com selo "⚠️ validar".

| Modelo | Dimensão publicada | Problema |
|---|---|---|
| 25 L | `1,30 x 42 x 53` | sem unidade; provável m + cm misturados |
| 60 L | `1,27 x 56 x 54 cm` | altura "1,27" rotulada cm, provável 1,27 m |
| 100 L | `1,27 x 66 x 70 cm` | idem |
| 200 L | `1,38 x 66 x 1,10 cm` | "1,10 cm" incoerente (provável 1,10 m) — erro sinalizado no briefing |

Outros pendentes: **voltagem** (110/220 — site não informa, sempre confirmar com o cliente) e **número de torneiras** por modelo (não especificado no site). Preços do site marcados `validar: true` (vitrine pode divergir da proposta).

---

## 5. Regras de negócio travadas no conteúdo

Nunca prometer potabilidade. Nunca prometer % de economia sem laudo. Nunca recomendar modelo só pelo total de pessoas (o **pico** define). Capacidade do reservatório ≠ limite diário. Compressor 15/25/60 = 1/10, 100/200 = 1/5. Refil = Acquabios Multi (1º brinde). Upsell só depois do cliente aceitar o bebedouro. Água de poço/problema aparente → avaliação técnica (não afirmar que só o refil resolve). Licitação: qualificar antes de precificar, nunca prática irregular.

---

## 6. Checklist de publicação

- [ ] Confirmar dimensões dos modelos 25/60/100/200 L com a fábrica e atualizar `produtos.js` (remover `dimensaoPendente`).
- [ ] Validar os preços do site vs tabela de proposta em `precos.js`.
- [ ] Revisar o conteúdo dos 21 módulos com um gestor comercial.
- [ ] Confirmar a oferta de upsell (R$159 / economia R$48) com a operação.
- [ ] Gravar e plugar os vídeos do Higgsfield.
- [ ] Testar em celular (layout já responsivo).
- [ ] `git push` e deploy do portal (Railway). O `kv_store` é criado sozinho no boot.

---

## 6b. Central de Treinamentos (gestor, multi-produto)

Painel consolidado em **`/treinamento/central`** (menu Gestão → Central de Treinamentos, restrito a gestor/CEO). Mostra uma **matriz vendedor × produto**: quem iniciou, % de módulos, prova e certificado em cada academia.

- Registry: **`data/treinamentos/catalogo.js`** — fonte única das academias. Para plugar uma nova academia de produto, adicione um item com `status:'ativo'`, `progressPrefix` (chave kv por usuário), `hubUrl`, `gestorUrl` e `modulosCount`. Ela passa a aparecer na matriz **sozinha**.
- Hoje: **Bebedouro Industrial** ativo; **Filtro de Entrada, Poço (Iron Free/Scale Stop), Refil/American/Condomínio e Ozônio** como "em breve".
- Motor: `lib/treinamentos-central.js` (montado com 1 linha no `server.js`). Lê o progresso direto do `kv_store` pelo prefixo de cada academia — sem acoplar ao motor de cada treinamento.

## 7. Sugestões de integração futura com Zoho CRM

O treinamento é a "escola"; o Zoho é o "campo". Pontos de integração naturais:

1. **Espelhar o checklist do Módulo 21** como layout/validação de campos no Deal do Zoho (segmento, pessoas, pico, turnos, modelo recomendado × solicitado, voltagem, torneiras, origem da água, decisor, processo, próximo passo + data, upsell apresentado/aceito, motivo de perda).
2. **Score BANT-DP (0–12)** como campo calculado no lead/deal, alimentando priorização (quente/qualificada/nutrir/pesquisa).
3. **Certificação como gate:** só liberar o vendedor para receber leads no round-robin depois de "Closer Certificado" (checar `treinbeb:progress:<user>.certificado`).
4. **Upsell dos 3 refis** como produto/linha no orçamento (módulo Quotes) para medir adesão real vs. o indicador do treinamento.
5. Expor um endpoint `/treinamento/bebedouros/api/progress` (já existe) para o painel de gestão comercial puxar o status de capacitação junto dos KPIs.
