# Templates UTILITY (transacionais) — Tudo de Filtro

> Criados em 22/Jun/2026 para cobrir a comunicação pós-venda/operacional que hoje a TDF
> manda como Marketing. Categoria **UTILITY** na Meta = ~8x mais barata que Marketing,
> e **grátis** se a janela de 24h (cliente respondeu) estiver aberta.

## ⚖️ Regras de ouro pra Meta aprovar como UTILITY (não cair em Marketing)
- A mensagem tem que ser sobre uma **transação que já existe** (pedido feito, instalação agendada, OS aberta, refil contratado, fatura emitida).
- **PROIBIDO** dentro de Utility: desconto, oferta, "aproveite", "condição especial", upsell, convite pra comprar, emoji/tom de campanha.
- Use **variáveis nomeadas** e dê exemplo de preenchimento. Não comece nem termine o corpo com variável.
- Nome técnico em `snake_case`, sem acento. Idioma: `pt_BR`.
- Se incluir botão, use Quick Reply (Confirmar/Remarcar) ou URL de rastreio/2ª via.

---

## JORNADA 1 — PEDIDO / ORÇAMENTO FECHADO

### 1. `pedido_confirmado`
- **Categoria:** UTILITY · **Idioma:** pt_BR · **Gatilho:** Deal vira "Fechado Ganho" / orçamento aceito
- **HEADER:** Pedido confirmado
- **BODY:**
```
Olá {{1}}, aqui é a Tudo de Filtro. Confirmamos seu pedido do {{2}}.

Número do pedido: {{3}}
Já demos início ao processo. Em breve entramos em contato para combinar a {{4}}.

Qualquer dúvida, é só responder por aqui.
```
- **FOOTER:** Tudo de Filtro - tratamento de água
- **BUTTONS (Quick Reply):** Falar com atendimento
- **Variáveis:** {{1}}=nome · {{2}}=produto (ex: Purificador AcquaBios) · {{3}}=nº pedido · {{4}}=entrega/instalação

---

## JORNADA 2 — ENTREGA (bebedouros / produtos enviados)

### 2. `pedido_saiu_entrega`
- **Categoria:** UTILITY · **Gatilho:** Expedição marca "saiu para entrega"
- **BODY:**
```
Oi {{1}}, seu pedido {{2}} saiu para entrega hoje, {{3}}.

Previsão de chegada: {{4}}. Pedimos que alguém esteja no local para receber.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=nº pedido · {{3}}=data · {{4}}=janela (ex: 9h às 12h)

### 3. `pedido_em_transporte`
- **Categoria:** UTILITY · **Gatilho:** Envio por transportadora com código de rastreio
- **BODY:**
```
Olá {{1}}, seu pedido {{2}} foi despachado pela transportadora {{3}}.

Código de rastreio: {{4}}
Você pode acompanhar a entrega pelo botão abaixo.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (URL):** Acompanhar entrega → {{5}}
- **Variáveis:** {{1}}=nome · {{2}}=nº pedido · {{3}}=transportadora · {{4}}=cód. rastreio · {{5}}=link

### 4. `pedido_entregue`
- **Categoria:** UTILITY · **Gatilho:** Entrega confirmada
- **BODY:**
```
{{1}}, confirmamos a entrega do seu pedido {{2}} em {{3}}.

Se precisar de ajuda com a instalação ou o uso, é só responder por aqui que orientamos você.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=nº pedido · {{3}}=data

---

## JORNADA 3 — INSTALAÇÃO / VISITA TÉCNICA

### 5. `instalacao_agendada`
- **Categoria:** UTILITY · **Gatilho:** Agendamento de instalação confirmado (Auvo/Operacional)
- **HEADER:** Instalação agendada
- **BODY:**
```
Olá {{1}}, sua instalação do {{2}} está agendada.

Data: {{3}}
Horário: {{4}}
Técnico responsável: {{5}}

Se precisar remarcar, toque no botão abaixo.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (Quick Reply):** Confirmar presença · Remarcar
- **Variáveis:** {{1}}=nome · {{2}}=produto · {{3}}=data · {{4}}=horário · {{5}}=técnico

### 6. `instalacao_lembrete_vespera`
- **Categoria:** UTILITY · **Gatilho:** Véspera da instalação (D-1)
- **BODY:**
```
Oi {{1}}, lembrete da sua instalação amanhã, {{2}}, às {{3}}.

Pedimos que o local esteja acessível e que haja alguém maior de idade para acompanhar.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (Quick Reply):** Confirmar · Remarcar
- **Variáveis:** {{1}}=nome · {{2}}=data · {{3}}=horário

### 7. `tecnico_a_caminho`
- **Categoria:** UTILITY · **Gatilho:** Técnico saiu para o atendimento
- **BODY:**
```
{{1}}, nosso técnico {{2}} está a caminho do seu endereço e chega em aproximadamente {{3}}.

Por favor, deixe o acesso liberado para o serviço.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=técnico · {{3}}=tempo (ex: 40 minutos)

### 8. `servico_concluido`
- **Categoria:** UTILITY · **Gatilho:** Instalação/serviço finalizado
- **BODY:**
```
{{1}}, a instalação do seu {{2}} foi concluída em {{3}}. ✅

Guarde este contato para suporte. Se algo não estiver funcionando como esperado, responda aqui que resolvemos.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=produto · {{3}}=data

---

## JORNADA 4 — ORDEM DE SERVIÇO / MANUTENÇÃO / REFIL

### 9. `visita_tecnica_agendada`
- **Categoria:** UTILITY · **Gatilho:** OS / visita técnica agendada
- **BODY:**
```
Olá {{1}}, sua visita técnica (OS {{2}}) está agendada para {{3}}, às {{4}}.

Motivo: {{5}}. Se precisar remarcar, é só responder por aqui.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (Quick Reply):** Confirmar · Remarcar
- **Variáveis:** {{1}}=nome · {{2}}=nº OS · {{3}}=data · {{4}}=horário · {{5}}=motivo

### 10. `troca_refil_agendada`
- **Categoria:** UTILITY · **Gatilho:** Manutenção/refil contratado com data prevista (NÃO usar para oferta de recompra avulsa)
- **BODY:**
```
Oi {{1}}, conforme a manutenção do seu {{2}}, a troca do refil está prevista para {{3}}.

Podemos confirmar essa data ou ajustar o melhor dia para você?
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (Quick Reply):** Confirmar data · Escolher outra data
- **Variáveis:** {{1}}=nome · {{2}}=equipamento/produto · {{3}}=data prevista
- ⚠️ **Atenção:** este só é Utility se o cliente já tem o equipamento/plano. Para vender refil a quem não comprou, é Marketing (use os templates de reengajamento).

### 11. `manutencao_concluida`
- **Categoria:** UTILITY · **Gatilho:** OS concluída
- **BODY:**
```
{{1}}, sua manutenção (OS {{2}}) foi concluída em {{3}}.

Serviço realizado: {{4}}. Próxima manutenção prevista: {{5}}.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=nº OS · {{3}}=data · {{4}}=serviço · {{5}}=próxima data

---

## JORNADA 5 — FINANCEIRO / COBRANÇA

### 12. `pagamento_confirmado`
- **Categoria:** UTILITY · **Gatilho:** Pagamento recebido/compensado
- **BODY:**
```
{{1}}, confirmamos o recebimento do seu pagamento de {{2}} referente ao pedido {{3}}.

Obrigado! Qualquer dúvida sobre a nota ou o pedido, responda por aqui.
```
- **FOOTER:** Tudo de Filtro
- **Variáveis:** {{1}}=nome · {{2}}=valor · {{3}}=nº pedido

### 13. `lembrete_vencimento`
- **Categoria:** UTILITY · **Gatilho:** Fatura/parcela a vencer (D-3 ou D-1)
- **BODY:**
```
Olá {{1}}, este é um lembrete de que a parcela {{2}} do seu pedido {{3}}, no valor de {{4}}, vence em {{5}}.

Se já pagou, desconsidere. Precisa da 2ª via? Toque no botão abaixo.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (URL):** 2ª via do boleto → {{6}}
- **Variáveis:** {{1}}=nome · {{2}}=nº parcela · {{3}}=nº pedido · {{4}}=valor · {{5}}=data · {{6}}=link

---

## JORNADA 6 — PÓS-VENDA

### 14. `pos_venda_acompanhamento`
- **Categoria:** UTILITY · **Gatilho:** D+3 após instalação/entrega (acompanhamento transacional, sem oferta)
- **BODY:**
```
Oi {{1}}, faz alguns dias que instalamos seu {{2}}. Está tudo funcionando bem com a água aí?

Se notou qualquer coisa fora do normal, me conta que a gente resolve.
```
- **FOOTER:** Tudo de Filtro
- **BUTTONS (Quick Reply):** Está tudo certo · Preciso de ajuda
- **Variáveis:** {{1}}=nome · {{2}}=produto
- *(NPS de 30 dias já existe: `posvenda_nps_30d` — manter.)*

---

## Resumo de submissão
14 templates Utility cobrindo: pedido, entrega (3), instalação/visita (4), OS/manutenção/refil (3), financeiro (2), pós-venda (1). Submeter no painel WATI/Meta com categoria **Utility**, idioma pt_BR. Após aprovação, apontar os fluxos do Operacional/Auvo/Financeiro para disparar estes em vez dos templates Marketing equivalentes.
