// ============================================================================
// MÓDULO 19 — Upsell dos 3 refis
// ----------------------------------------------------------------------------
// O simulador de upsell (tabela de preços + botões apresentado/aceito/recusado)
// é EMBUTIDO automaticamente pela view. NÃO recriar tabela de preços aqui.
// Números oficiais vêm de precos.js → UPSELL_REFIL.
// ============================================================================

module.exports = {
  resumoCurto: 'Como e quando oferecer os 3 refis Acquabios Multi: só depois do sim ao bebedouro, como fechamento de valor — nunca como empurrão.',
  video: { url: '', thumb: '', duracaoSeg: 0, transcricao: '', legenda: '', assistidoTrackId: 'mod-19-upsell-video' },

  blocos: [
    { tipo: 'texto', html: 'O upsell dos refis não é "vender mais uma coisa". É <strong>garantir que o cliente continue com água bem filtrada</strong> depois da instalação, sem sustos e sem precisar correr atrás de refil avulso lá na frente. Feito na hora certa, é um dos fechamentos mais naturais que você tem.' },

    { tipo: 'titulo', texto: 'O momento é tudo' },
    { tipo: 'texto', html: 'A regra é simples: <strong>só ofereça os refis depois que o cliente já aceitou o bebedouro</strong>. Antes disso, refil vira ruído — o cliente ainda está decidindo o principal e você desvia o foco. Depois do "sim" ao equipamento, o refil deixa de ser objeção e vira <strong>complemento lógico da decisão que ele acabou de tomar</strong>.' },
    { tipo: 'callout', variante: 'alerta', titulo: 'Sequência correta',
      html: '1) Fechou o bebedouro. 2) <strong>Só então</strong> apresente a condição dos refis. Nunca misture os dois no mesmo momento de decisão — um de cada vez.' },

    { tipo: 'titulo', texto: 'O script principal' },
    { tipo: 'script', contexto: 'Logo após o cliente aceitar o bebedouro, antes de fechar o pedido',
      fala: 'Antes de finalizar, o equipamento já acompanha o primeiro refil como brinde. Temos uma condição para quem compra o bebedouro: cada refil custa normalmente R$ 69,00, mas você pode levar mais três por R$ 159,00. Assim, já fica com as próximas trocas programadas e evita precisar comprar separadamente depois. Posso incluir?' },
    { tipo: 'texto', html: 'Repare no encadeamento: <strong>brinde primeiro</strong> (o cliente já ganhou algo), depois a <strong>condição exclusiva de quem compra o bebedouro</strong>, e por fim uma <strong>pergunta de fechamento</strong> ("posso incluir?"). Com a oferta o cliente fica com <strong>4 refis no total</strong> — o brinde mais os três — e economiza <strong>R$ 48,00</strong> em relação a comprar os três avulsos.' },

    { tipo: 'titulo', texto: 'Variações por segmento' },
    { tipo: 'texto', html: 'Mesma oferta, mesmos números — muda só o argumento que faz sentido para cada cliente. Adapte o tom sem alterar os valores.' },

    { tipo: 'script', contexto: 'Empresa / escritório',
      fala: 'Como o bebedouro vai atender o time todo, faz sentido já deixar as trocas de refil programadas. O primeiro já vem de brinde; com mais três por R$ 159,00 em vez de R$ 69,00 cada, você não precisa abrir uma nova compra a cada troca — já fica resolvido. Posso incluir?' },

    { tipo: 'script', contexto: 'Indústria / galpão',
      fala: 'Em operação de uso intenso, o refil trabalha bastante e você não quer parar para providenciar um avulso na hora errada. O equipamento já vem com o primeiro; levando mais três por R$ 159,00 você deixa as próximas trocas garantidas e planejadas. Posso incluir?' },

    { tipo: 'script', contexto: 'Obra / construção civil',
      fala: 'Na obra tudo tem que estar à mão, e parar para comprar refil avulso atrapalha. O primeiro já acompanha o bebedouro; com mais três por R$ 159,00, em vez de R$ 69,00 cada, você já leva as trocas do ciclo junto com o equipamento. Posso incluir?' },

    { tipo: 'script', contexto: 'Escola',
      fala: 'Com a criançada usando o dia inteiro, o ideal é não deixar faltar troca de refil. O primeiro já vem de brinde; com mais três por R$ 159,00 você deixa as próximas trocas programadas e evita compra de última hora no meio do período letivo. Posso incluir?' },

    { tipo: 'script', contexto: 'Academia',
      fala: 'No pico dos treinos o bebedouro é muito requisitado, então vale manter o refil sempre em dia. O primeiro acompanha o equipamento; levando mais três por R$ 159,00 em vez de R$ 69,00 cada, você já garante as próximas trocas sem precisar lembrar de recomprar. Posso incluir?' },

    { tipo: 'script', contexto: 'Comprador / setor de compras',
      fala: 'Para simplificar o processo de vocês, dá para já incluir os refis nesta mesma compra. O primeiro vem de brinde; mais três saem por R$ 159,00, contra R$ 207,00 se comprados depois avulsos — uma economia de R$ 48,00 e menos um pedido para abrir lá na frente. Posso incluir na proposta?' },

    { tipo: 'script', contexto: 'Revendedor',
      fala: 'Já que você revende, deixar os refis inclusos ajuda a girar com o cliente final e a não ficar sem item de reposição. O primeiro acompanha o bebedouro; com mais três por R$ 159,00 em vez de R$ 69,00 cada, você já sai com o ciclo coberto. Posso incluir?' },

    { tipo: 'titulo', texto: 'Objeção: "não quero os refis"' },
    { tipo: 'texto', html: 'Tudo bem. O upsell é uma oferta, não uma exigência — e forçar queima a boa relação que você acabou de construir ao fechar o bebedouro.' },
    { tipo: 'script', contexto: 'Cliente recusa os refis',
      fala: 'Sem problema, deixo só o bebedouro então. Lembrando que o primeiro refil já acompanha o equipamento, então você começa tranquilo. Quando chegar perto da próxima troca, é só me chamar que a gente resolve — o refil unitário fica R$ 69,00. Fechado assim?' },
    { tipo: 'texto', html: 'Registre no CRM que o upsell foi <strong>apresentado e recusado</strong>. Isso não é derrota: é um gancho documentado para uma abordagem futura, quando o cliente estiver perto da próxima troca.' },

    { tipo: 'callout', variante: 'info', titulo: 'O que o refil é (e o que não prometer)',
      html: 'O refil Acquabios Multi é o <strong>elemento filtrante</strong> do bebedouro — é ele que faz a filtragem da água. A troca segue o <strong>uso e a qualidade da água local</strong>, então não prometa data fixa. Comunique como <strong>aproximadamente um ano de trocas programadas, conforme a periodicidade orientada e as condições de uso</strong>. Nunca prometa potabilidade nem percentual de economia.' },

    { tipo: 'dodont',
      fazer: [
        'Oferecer os refis SÓ depois do sim ao bebedouro.',
        'Começar pelo brinde e fechar com "posso incluir?".',
        'Falar em trocas programadas e conveniência de já ter em casa.',
        'Registrar no CRM se foi apresentado, aceito ou recusado.',
      ],
      evitar: [
        'Empurrar refil antes de o cliente decidir o equipamento.',
        'Prometer prazo fixo de troca como garantia.',
        'Prometer potabilidade ou economia em percentual.',
        'Insistir depois de um "não" claro.',
      ]
    },
  ],

  perguntasRapidas: [
    {
      pergunta: 'Qual é o momento certo para oferecer os 3 refis?',
      opcoes: [
        'Logo no início, junto com a apresentação do bebedouro.',
        'Só depois que o cliente já aceitou o bebedouro.',
        'Sempre por último, mesmo que o cliente ainda esteja em dúvida sobre o equipamento.',
      ],
      correta: 1,
      explicacao: 'Refil é complemento da decisão. Oferecido antes do sim ao equipamento, vira ruído e desvia o foco do principal.'
    },
    {
      pergunta: 'Com a oferta dos 3 refis por R$ 159,00, com quantos refis o cliente fica no total e quanto economiza?',
      opcoes: [
        '3 refis no total, economia de R$ 69,00.',
        '4 refis no total (1 brinde + 3), economia de R$ 48,00.',
        '4 refis no total, sem economia.',
      ],
      correta: 1,
      explicacao: 'O primeiro refil já acompanha o bebedouro (brinde) e a oferta soma mais 3, totalizando 4. Os 3 avulsos sairiam por R$ 207,00; na condição, R$ 159,00 — economia de R$ 48,00.'
    },
    {
      pergunta: 'O cliente diz "não quero os refis". Qual a melhor reação?',
      opcoes: [
        'Insistir, explicando de novo a economia até ele aceitar.',
        'Aceitar tranquilo, lembrar do brinde, deixar o gancho para a próxima troca e registrar no CRM.',
        'Cancelar a venda do bebedouro também.',
      ],
      correta: 1,
      explicacao: 'Upsell é oferta, não exigência. Respeitar o não preserva a relação e deixa um gancho documentado para o futuro.'
    },
  ],

  exercicio: {
    enunciado: 'Escreva sua própria versão do script principal para um cliente de indústria que acabou de fechar um bebedouro de uso intenso. Mantenha os números oficiais (brinde, R$ 69,00 unitário, 3 por R$ 159,00) e termine com uma pergunta de fechamento.',
    dica: 'Sequência: brinde → condição exclusiva → benefício de trocas programadas → "posso incluir?". Não prometa prazo fixo de troca.'
  },

  resumo: 'O upsell dos 3 refis Acquabios Multi só entra depois do sim ao bebedouro. Script: brinde + condição (R$ 69,00 avulso vs. 3 por R$ 159,00) + "posso incluir?". Com a oferta o cliente fica com 4 refis e economiza R$ 48,00. Adapte o argumento por segmento, respeite o não e registre no CRM. Nunca prometa prazo fixo de troca, potabilidade ou economia percentual.'
};
