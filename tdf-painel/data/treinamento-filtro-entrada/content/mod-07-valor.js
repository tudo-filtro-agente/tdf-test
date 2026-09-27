// Módulo 7 — Apresentação de valor. Característica → Benefício → Impacto. Sem prometer potabilidade.
module.exports = {
  resumoCurto: 'Valor não é listar spec: é ligar Característica → Benefício → Impacto na vida do cliente. Água melhor na casa toda, menos cloro/sedimento/gosto, proteção de encanamento — sem prometer potabilidade absoluta.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'fe-valor-video' },
  blocos: [
    { tipo: 'callout', variante: 'info', titulo: 'A régua do valor',
      html: 'Cliente não compra "3 estágios". Ele compra <strong>banho sem cheiro de cloro</strong> e <strong>copo sem barro no fundo</strong>. Traduza toda característica em benefício e, principalmente, em <strong>impacto na vida dele</strong>.' },
    { tipo: 'titulo', texto: 'Característica → Benefício → Impacto' },
    { tipo: 'tabela', head: ['Característica', 'Benefício', 'Impacto na vida do cliente'], rows: [
      ['Trata a água no ponto de entrada', 'Água melhor na casa toda', '"Não é só a pia — é o banho, a máquina de lavar, tudo. Você para de conviver com o incômodo."'],
      ['Carvão no Light Filter', 'Reduz cloro, gosto e odor', '"Some o cheiro de piscina no banho e o gosto ruim — com o cuidado de manter a caixa higienizada."'],
      ['American Filter mantém o cloro (sem carvão)', 'Preserva a proteção do cloro na casa/caixa', '"A água fica limpa do sedimento mas continua protegida na caixa d\'água — o cloro tem essa função."'],
      ['Etapa de sedimentos', 'Retém barro, areia e ferrugem da rede', '"Chega de barro no fundo do copo depois que falta água na rua."'],
      ['Retém sedimento antes de circular', 'Ajuda a proteger encanamento e eletrodomésticos', '"Menos sujeira circulando protege registros, torneiras e aparelhos que usam água."'],
      ['Solução única para a casa', 'Praticidade e tranquilidade', '"Você resolve de uma vez, sem ficar trocando filtrinho de torneira toda hora."'],
    ]},
    { tipo: 'titulo', texto: 'Ancore no que o cliente disse' },
    { tipo: 'texto', html: 'O valor é <strong>personalizado pela dor da qualificação</strong>. Se ele reclamou de <strong>gosto/cheiro de cloro</strong>, o herói é o <strong>Light Filter</strong> (com carvão) — lembrando o cuidado com a caixa. Se ele quer limpar a água <strong>mas manter a proteção do cloro</strong>, o herói é o <strong>American Filter</strong> (sem carvão). Se reclamou de barro, o <strong>sedimento</strong> é. Se foi "não confio", o impacto é <strong>tranquilidade e melhora perceptível</strong>. Não despeje benefícios — foque no que dói nele e escolha a família certa.' },
    { tipo: 'callout', variante: 'perigo', titulo: 'Linha que não se cruza',
      html: 'NUNCA prometa <strong>potabilidade absoluta</strong>, "água 100% pura" ou <strong>remoção garantida</strong> de contaminante específico. O valor é a <strong>melhora real</strong> (menos cloro, menos sedimento, melhor gosto, proteção) — não uma garantia sanitária que você não pode assegurar.' },
    { tipo: 'especialista', nome: 'apresentação de valor',
      html: 'Depois de ligar característica→benefício→impacto, ele <strong>confirma com o cliente</strong>: "Faz sentido pra você resolver isso na casa toda?" Isso transforma a apresentação em compromisso e prepara o fechamento. Valor sem confirmação vira monólogo.' },
    { tipo: 'script', contexto: 'Valor ancorado na dor de cloro (Light Filter)',
      fala: 'Esse cheiro de cloro vem do que a concessionária usa pra desinfetar a água. Pra tirar o gosto e o cheiro na casa toda, eu levo o Light Filter, que tem carvão no elemento. Um detalhe importante: o cloro também protege a água na sua caixa d\'água, então quando a gente tira, vale manter a caixa higienizada e a troca em dia. Se o seu foco é mais limpar a sujeira sem mexer nessa proteção, o American Filter faz isso mantendo o cloro. Qual te atende melhor?' },
    { tipo: 'pendente', titulo: 'Números de desempenho',
      html: 'Percentuais de redução, capacidade e desempenho específico <strong>vêm da ficha técnica oficial da TDF</strong>. Fale do benefício em linguagem de experiência ("reduz bastante o cheiro de cloro") sem cravar percentual que você não confirmou.' },
    { tipo: 'dodont',
      fazer: ['Ligar cada característica a benefício e impacto na vida.', 'Focar na dor que o cliente citou na qualificação.', 'Confirmar o valor com o cliente antes de avançar.'],
      evitar: ['Prometer potabilidade absoluta ou remoção garantida.', 'Cravar percentuais de redução sem ficha técnica.', 'Despejar todos os benefícios sem foco na dor real.'] },
  ],
  perguntasRapidas: [
    { pergunta: 'Qual a estrutura correta de apresentação de valor?', opcoes: ['Só listar as características técnicas.', 'Característica → Benefício → Impacto na vida do cliente.', 'Só falar de preço.'], correta: 1, explicacao: 'Valor é traduzir a característica em benefício e, principalmente, em impacto real na vida do cliente.' },
    { pergunta: 'O que você NUNCA deve prometer na apresentação de valor?', opcoes: ['Que reduz o cheiro de cloro.', 'Potabilidade absoluta / água 100% pura / remoção garantida de contaminante.', 'Que trata a casa toda.'], correta: 1, explicacao: 'Melhora real pode; garantia sanitária absoluta, não. É a linha que não se cruza.' },
    { pergunta: 'O cliente só reclamou de barro. Onde você foca o valor?', opcoes: ['Em todos os benefícios de uma vez.', 'Na etapa de sedimentos e no impacto de acabar com o barro no copo.', 'No preço mais baixo.'], correta: 1, explicacao: 'Foque na dor citada: barro → sedimentos → impacto concreto (copo sem barro).' },
  ],
  exercicio: { enunciado: 'O cliente reclamou de "água amarelada às vezes e gosto ruim". Monte uma fala de valor em Característica → Benefício → Impacto para cada dor, sem prometer pureza absoluta.', dica: 'Sedimento/ferrugem da rede → retenção → água mais limpa no copo; carvão → reduz gosto/odor → água mais agradável. Feche confirmando com o cliente.' },
  resumo: 'Apresentar valor é ligar Característica → Benefício → Impacto na vida do cliente: água melhor na casa toda, menos cloro/sedimento/gosto e proteção de encanamento/eletrodomésticos. Ancore na dor da qualificação, confirme com o cliente e nunca prometa potabilidade absoluta, água 100% pura ou remoção garantida — percentuais vêm da ficha técnica.'
};
