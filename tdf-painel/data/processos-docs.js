// Documentação do Processo Comercial — visão do gestor.
// Cada seção vira um bloco na página /processos. Atualizar AQUI a cada mudança
// de regra/robô (é a fonte oficial; o changelog fica na última seção).
module.exports = {
  atualizadoEm: '2026-07-15',
  secoes: [
    {
      id: 'fluxo',
      icon: '🗺️',
      titulo: 'Fluxo do lead — visão geral',
      html: `
<p>Todo lead segue o mesmo trilho, independente do canal de entrada (Google, Meta, Leadster, WhatsApp/GCTWA, loja):</p>
<ol>
  <li><b>Entrada</b> — o lead vira Contato + Negociação no Zoho. Robô de dedup remove duplicatas de entrada (mesmo telefone em 24h → mantém 1).</li>
  <li><b>Tarefa garantida</b> — nenhuma negociação aberta fica sem tarefa: se em 30 minutos não nasceu nenhuma, a rede de segurança cria "LIGAR — lead sem régua".</li>
  <li><b>Cadência por prazo</b> — as réguas novas segmentam por <b>prazo de compra</b> (Urgente/30 dias) e por produto (Estação × Poço), não só por estágio.</li>
  <li><b>Qualificação</b> — pré-venda qualifica (SPIN/BANT) e move pra Qualificado → closer assume.</li>
  <li><b>Proposta</b> — proposta de verdade tem <b>Quote no CRM + data de fechamento</b>. Proposta enviada até dia 24 conta no fechamento do mês.</li>
  <li><b>Fechamento</b> — Fechado Ganho exige categoria de produto; venda por indicação marca quem indicou (programa de indicação).</li>
</ol>`
    },
    {
      id: 'regras',
      icon: '📏',
      titulo: 'Regras de ouro do processo (valem pra todo o time)',
      html: `
<ul>
  <li><b>1 tarefa de ligação aberta por negociação.</b> Excedentes criadas por qualquer automação são removidas pelo robô — a régua recria a próxima quando a atual for concluída. Executar 3 tarefas acumuladas com 1 ligação NÃO é cadência.</li>
  <li><b>Tarefa de ligação só se conclui LIGANDO pelo GoTo.</b> Conclusão sem ligação real registrada reabre sozinha em até 15 minutos (vale pra tarefas dos últimos 7 dias, de negociação aberta).</li>
  <li><b>Ligação que conta no painel: conectada acima de 30 segundos.</b> Rediscagem de 6 segundos é tentativa, não contato.</li>
  <li><b>Estágio Proposta = Quote no CRM + data de fechamento preenchida.</b> "Passei o preço no WhatsApp" não é proposta: não entra na métrica e não é auditável.</li>
  <li><b>Nenhum lead sem tarefa, nunca.</b> Se você concluiu a última tarefa de um lead que continua aberto, agende a próxima — senão a rede de segurança agenda por você (e fica registrado).</li>
  <li><b>Follow-up tem dono, dia e motivo.</b> "Pede retorno amanhã" registrado na tarefa. Empurrar data em bloco é o primeiro sinal que o gestor vê no raio-x.</li>
  <li><b>Visita técnica nunca é "gratuita" e proposta nunca é "sem compromisso"</b> — copy proibida em qualquer canal.</li>
  <li><b>Perda sempre com motivo real.</b> "Não tenho interesse", "ligou engano", "comprou do concorrente", "fora de área" são descartes legítimos — na primeira ligação que for. O que não existe é perder <b>sem motivo nenhum</b>; e o motivo "não atende/sem contato" só vale depois da cadência completa (6+ tentativas em 3+ dias). O robô guarda-descarte reabre perda sem motivo (lead frio de score baixo é a única exceção).</li>
  <li><b>Motivo da perda é obrigatório</b> ao dar Fechado Perdido (trava em implantação — hoje 100% das perdas de jun-jul estão sem motivo, o que impede o raio-x de erros).</li>
</ul>`
    },
    {
      id: 'robos',
      icon: '🤖',
      titulo: 'Robôs de guarda (rodam sozinhos na VPS)',
      html: `
<p>Camada automática que impede lead esquecido, tarefa fantasma e conclusão de mentira. <b>Robôs que criam tarefa só rodam em horário comercial</b> — ninguém recebe tarefa de madrugada. Logs na VPS (~/tools/*.log); incidentes aparecem no Telegram do gestor.</p>
<table>
  <tr><th>Robô</th><th>Frequência</th><th>O que faz</th></tr>
  <tr><td>Guardião de tarefas</td><td>a cada 5 min</td><td>Reabre tarefa que nasceu e foi fechada em menos de 90s (efeito de workflow zumbi).</td></tr>
  <tr><td>Rede de segurança</td><td>a cada 15 min (8h–18h, seg–sáb)</td><td>Negociação aberta há 30+ min sem NENHUMA tarefa ganha "LIGAR — lead sem régua". Tem memória própria: não duplica.</td></tr>
  <tr><td>Dedup de entrada</td><td>a cada 10 min</td><td>Deals abertos criados nas últimas 24h com o mesmo telefone → mantém o mais antigo, apaga o resto (GCTWA cria 1 deal por mensagem).</td></tr>
  <tr><td>Dedup de ligações</td><td>2× por hora</td><td>Garante no máximo 1 tarefa de ligação aberta por negociação; remove WhatsApp "acabei de te ligar" prematuro.</td></tr>
  <tr><td>Trava de ligação</td><td>4× por hora (8h–19h BRT, seg–sáb)</td><td>Tarefa de ligação concluída sem chamada real do GoTo no dia → reabre (carência de 15 min pro log cair). Só olha tarefas ≤7 dias de negociação aberta.</td></tr>
  <tr><td>Raio-X diário</td><td>07h05</td><td>Placar de ontem + acumulado do mês vs metas (FE 400k / BEB 250k), por departamento, no Telegram e na Central de Resultados.</td></tr>
  <tr><td>Upsell bebedouro D+1</td><td>10h00</td><td>Quem comprou bebedouro ontem recebe a oferta do kit 3 refis R$ 159 no WhatsApp.</td></tr>
  <tr><td>Prêmios de indicação</td><td>14h30 (seg–sáb)</td><td>Detecta conversão de indicado → cria tarefa do prêmio (1ª = troca grátis; 3ª = válvula automática) e avisa no Telegram.</td></tr>
  <tr><td>Guarda de descarte</td><td>2× por hora (8h–20h, seg–sáb)</td><td>Deal perdido <b>sem motivo</b> (ou com "não atende" sem cadência completa) → reabre 1× pro estágio anterior + tarefa pedindo o motivo real. Motivo legítimo registrado = descarte aceito. Segundo descarte inválido só reporta ao gestor.</td></tr>
  <tr><td>Lead score</td><td>a cada 15 min</td><td>Recalcula Score_Lead/Tier_Lead das negociações movimentadas. Escrita silenciosa: não dispara workflow do Zoho.</td></tr>
</table>`
    },
    {
      id: 'cadencias',
      icon: '📞',
      titulo: 'Cadências do Zoho — o que está ligado e o que foi desligado',
      html: `
<p><b>Ativas (novas, por prazo):</b> ETA Urgente, ETA 30D, POÇO Urgente, POÇO 30D — publicadas 14/07. Segmentam por prazo de compra e produto; a Ligação 1 tem popup de instrução. Avanço de etapa só com a tarefa anterior concluída.</p>
<p><b>Desligadas em 15/07</b> (causavam tarefa "ligar imediato" em lead frio):</p>
<ul>
  <li><b>"Qualificado"</b> (6.142 inscritos) — disparava por estágio ignorando prazo; pegava lead reativado automaticamente.</li>
  <li><b>"Leads Novos"</b> (4.436) — a régua das "Ligação para Lead 1, 2, 3..." empilhadas.</li>
</ul>
<p><b>Workflows zumbis desativados em 15/07:</b> "Fechar Tareffa errada de IA" + 2 variantes de "Fechar Apresentação" — fechavam sozinhos toda tarefa com "Ligar" no nome (as tarefas nasciam concluídas).</p>
<p><b>Em análise (não desligar sem investigar):</b> "Cadência primeira hora ativa" (Contatos), "Proposta-Lead prioridade" e demais réguas de proposta — o conserto certo nelas é o gatilho (avançar só com conclusão), não o desligamento.</p>`
    },
    {
      id: 'campanhas',
      icon: '📣',
      titulo: 'Campanhas WhatsApp & réguas de resposta',
      html: `
<ul>
  <li><b>Templates:</b> só os aprovados com prefixo <code>ia_</code>. Objeção se responde com resposta rápida do atendente, nunca com template novo.</li>
  <li><b>Dedup de disparo:</b> ninguém recebe 2 campanhas em 7 dias (SENT-LEDGER). Válido pra toda lista nova.</li>
  <li><b>Régua pós-campanha:</b> D+4 sem resposta → follow-up automático; depois a cada 30 dias (máx 3). Respondeu → sai da régua e o time assume.</li>
  <li><b>Troca de elemento FE (em curso):</b> base de 867 clientes vencidos ≤200km. 595 tocados 13–14/07 e 234 em 15/07 (teste A/B: "aviso" × "benefício"). Falha de entrega (sem WhatsApp) vira lista de ligação.</li>
  <li><b>Métrica da campanha é no CRM:</b> resposta → deal → Fechado Ganho. Placar parcial 15/07: 595 tocados → 90 respostas → 5 vendas (R$ 7.870) + 6 agendadas.</li>
</ul>`
    },
    {
      id: 'indicacao',
      icon: '🎁',
      titulo: 'Programa de indicação (cliente FE)',
      html: `
<ul>
  <li><b>Prêmios:</b> 1 indicado que fecha = próxima troca de elemento grátis; 3 indicados que fecham = válvula automática instalada.</li>
  <li><b>Registro no CRM (obrigatório na venda):</b> campo <code>Venda por Indicação = Sim</code> + <code>Indicado Por</code> (contato) ou telefone do indicador. Sem registro, o prêmio não é atribuído.</li>
  <li><b>Robô diário (14h30)</b> conta as conversões por indicador, cria a tarefa do prêmio pro time e avisa o gestor no Telegram.</li>
  <li>Divulgação: e-mail de check-up pra base (94 enviados 15/07) + rodapé das campanhas de troca.</li>
</ul>`
    },
    {
      id: 'metas',
      icon: '🎯',
      titulo: 'Metas de julho & Raio-X',
      html: `
<ul>
  <li><b>Metas por departamento (nunca meta geral):</b> Filtro de Entrada R$ 400 mil · Bebedouro R$ 250 mil. Forecast e cobrança sempre separados por departamento (FE, Bebedouro, água não tratada, refis).</li>
  <li><b>Raio-X diário 07h05:</b> ontem + acumulado + quanto falta por dia útil + projeção + propostas novas. No Telegram do gestor e na <a href="/resultados">Central de Resultados</a>.</li>
  <li><b>Regra do mês:</b> proposta enviada até 24/07 conta pro fechamento de julho.</li>
  <li><b>Planos individuais:</b> cada closer tem plano em PDF (metas de propostas e conversão) enviado por e-mail e postado na Central de Resultados.</li>
</ul>`
    },
    {
      id: 'auditoria',
      icon: '🔎',
      titulo: 'Como auditar um vendedor ou um lead (roteiro do gestor)',
      html: `
<ol>
  <li><b>Ligações do dia:</b> registros do GoTo no Zoho (ligação real = log GoTo; conectada = >30s). Rediscagem pro mesmo número conta 1 pessoa.</li>
  <li><b>Fila ativa:</b> negociações abertas fora de Nutrição IA. Cruzar: quais receberam ligação real hoje/na semana.</li>
  <li><b>Propostas:</b> estágio Proposta sem Quote ou sem data de fechamento = proposta de fachada. Data de fechamento vencida = atualizar ou perder com motivo.</li>
  <li><b>Tarefas:</b> vencidas hoje ainda abertas + follows empurrados em bloco pro dia seguinte são os dois sinais de fila maquiada.</li>
  <li><b>Lead suspeito ("quem criou/fechou isso?"):</b> a timeline do Zoho (v5) mostra a origem de cada ação — workflow, cadência, tela (crm_ui) ou robô (crm_api). É assim que se separa erro humano de automação.</li>
  <li><b>Ligação específica:</b> gravação fica no S3 (GoTo arquiva sozinho); Closy pontua as dos vendedores cadastrados. Qualquer gravação pode ser transcrita e analisada sob demanda.</li>
</ol>`
    },
    {
      id: 'changelog',
      icon: '📜',
      titulo: 'Changelog do processo (o que mudou e por quê)',
      html: `
<p><b>16/07/2026</b></p>
<ul>
  <li><b>Academia Técnicas de Vendas revisada contra os livros antes do lançamento ao time</b>: 23 correções (método de objeções do Blount corrigido pra Ledge–Disrupt–Ask; política única de instalação R$590 como moeda de fechamento; removidos "visita gratuita", desconto no produto, galão como implicação, preços e estudos inventados; 3 módulos com arquivo quebrado consertados). Parecer completo na Central de Resultados.</li>
  <li>Academia ganhou <b>aula em vídeo de 8 minutos</b> (resumo das 5 fases) no topo da página — trilha auditada antes de publicar.</li>
  <li><b>Home do portal reorganizada</b>: novidades compactas (expandem ao clicar), avisos antigos recolhidos, atalhos agrupados por finalidade (Trabalho do dia · Escola TDF · Consulta rápida · Resultados & Gestão).</li>
</ul>
<p><b>15/07/2026</b></p>
<ul>
  <li>Desativados 3 workflows que fechavam tarefas sozinhos ("Fechar Tareffa errada de IA" + 2 "Fechar Apresentação") — tarefas nasciam concluídas.</li>
  <li>Desligadas as cadências antigas "Qualificado" e "Leads Novos" (tarefa imediata em lead frio); réguas novas por prazo assumem.</li>
  <li>Instalada a família de robôs de guarda (dedup entrada/ligações, trava de ligação, rede de segurança, guardião).</li>
  <li>Trava de ligação ajustada: só fiscaliza tarefas ≤7 dias de negociação aberta (antes reabria backlog de 2024 e criava pingue-pongue com o vendedor).</li>
  <li>Push do lead score virou escrita silenciosa (trigger vazio) — antes cada gravação de score acordava workflows do Zoho e chegava a reatribuir dono de lead antigo.</li>
  <li>Régua pós-campanha corrigida: broadcast do WATI não conta mais como "cliente respondeu" (bug que mataria os follow-ups D+4).</li>
  <li>Campanha troca FE: +234 clientes nunca contatados disparados; repassada de 79 respondentes sem venda e 146 sem WhatsApp entregues pro time ligar.</li>
  <li>Upsell bebedouro: normalização de telefone com parênteses corrigida.</li>
  <li><b>Guarda de descarte criada</b> após auditoria: 1.020 perdidos em 7 dias, 90% sem pontos reais de contato (incl. R$ 139 mil com zero ligação). Regra: perda sempre com motivo real; "não atende" só após cadência completa; sem motivo → robô reabre.</li>
</ul>
<p><b>14/07/2026</b> — Cadências novas ETA/POÇO × Urgente/30D publicadas; censo de automação (253 workflows, 3 graves); atribuição Água de Poço corrigida.</p>
<p><b>Regra de manutenção:</b> toda mudança de processo/robô entra aqui no mesmo dia. Esta página é a fonte oficial pro gestor.</p>`
    },
  ],
};
