// ============================================================
// Roleplays – Treinamento Técnicas de Vendas  (Tudo de Filtro)
// 12 cenários × 3 passos × 3 opções = 108 opções
// CommonJS
// ============================================================

const ROLEPLAYS = [

  /* =========================================================
     1. SPIN Puro – Água com cheiro de cloro
     ========================================================= */
  {
    id: 1,
    titulo: 'SPIN Puro – Água com Cheiro de Cloro',
    obrigatorio: true,
    contexto:
      '<p>O cliente liga dizendo que a água da casa tem <strong>cheiro forte de cloro</strong>. ' +
      'Ele não sabe se isso é grave e nunca pesquisou filtros antes. ' +
      'Use a sequência SPIN: <em>Situação → Problema → Implicação → Necessidade</em>.</p>',
    passos: [
      {
        fala: 'Oi, tudo bem? Liguei porque a água aqui de casa tem um cheiro forte de cloro. Não sei se é normal…',
        opcoes: [
          {
            texto: 'Entendo! Me conta: sua casa é abastecida por poço ou pela concessionária? E quantas pessoas moram aí?',
            adequada: true,
            pontos: 3,
            porque: 'Pergunta de Situação clássica do SPIN – levanta contexto antes de qualquer oferta.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Normal não é! Tenho aqui o Filtro de Entrada que resolve isso. Quer que eu passe os valores?',
            adequada: false,
            pontos: 0,
            porque: 'Pular direto pra oferta ignora o diagnóstico e gera resistência.',
            risco: 'Cliente sente que você quer empurrar produto e desliga.',
            melhora: 'Antes de falar de produto, faça perguntas de Situação para entender o cenário.'
          },
          {
            texto: 'Esse cheiro forte de cloro incomoda mesmo. Você já fez alguma análise da água?',
            adequada: false,
            pontos: 1,
            porque: 'Começa a investigar, mas pula a Situação e vai direto ao Problema – perde contexto.',
            risco: 'Sem saber se é poço ou concessionária, a recomendação pode ser equivocada.',
            melhora: 'Pergunte primeiro sobre a fonte de água e número de moradores para qualificar.'
          }
        ]
      },
      {
        fala: 'É da Sabesp. Moramos em 4 – eu, minha esposa e dois filhos pequenos. O cheiro incomoda bastante na hora do banho.',
        opcoes: [
          {
            texto: 'Com crianças pequenas, você já percebeu se a pele deles fica ressecada ou com alguma irritação depois do banho?',
            adequada: true,
            pontos: 3,
            porque: 'Pergunta de Implicação – conecta o problema a consequências reais na família.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Entendi. E além do cheiro, a água sai com cor ou gosto estranho?',
            adequada: false,
            pontos: 1,
            porque: 'Boa pergunta de Problema, mas neste ponto o problema já está claro – hora de Implicação.',
            risco: 'Ficar preso em perguntas de Problema sem avançar no SPIN alonga a conversa sem gerar urgência.',
            melhora: 'Avance para Implicação: pergunte sobre impactos na saúde, eletrodomésticos ou rotina.'
          },
          {
            texto: 'Para 4 pessoas, o ideal seria o Filtro de Entrada de 1.000 L/h. Posso mandar a proposta?',
            adequada: false,
            pontos: 0,
            porque: 'Ofertar sem Implicação nem Necessidade – o cliente não vê valor suficiente ainda.',
            risco: 'Cliente responde "vou pensar" porque não percebeu a gravidade.',
            melhora: 'Antes de dimensionar, explore consequências do cloro na pele das crianças e nos eletrodomésticos.'
          }
        ]
      },
      {
        fala: 'Agora que você falou… minha filha mais nova vive com a pele seca. Será que tem a ver?',
        opcoes: [
          {
            texto: 'Pode ter relação, sim. E aqui vai um ponto importante: pra cheiro e gosto de cloro, a solução certa é o Light Filter, que tem carvão ativado, ou o tratamento no ponto de consumo. O American Filter é sem carvão de propósito — ele mantém o cloro residual, que é seu aliado na reservação: protege a caixa d\'água e a tubulação. Se faz sentido resolver isso de vez pra família, posso dimensionar a solução ideal pro seu caso. Quer que eu apresente?',
            adequada: true,
            pontos: 3,
            porque: 'Pergunta de Necessidade-Payoff + solução tecnicamente correta: descloro é no Light Filter (com carvão) ou no ponto de consumo; o American mantém o cloro residual de propósito para proteger a reservação.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Sim, cloro resseca a pele. Vou mandar a proposta do American Filter por WhatsApp, tá?',
            adequada: false,
            pontos: 0,
            porque: 'Além de pular a pergunta de Necessidade, indica o produto errado: o American Filter é SEM carvão e mantém o cloro residual de propósito — não resolve cheiro/gosto de cloro.',
            risco: 'Cliente instala, o cheiro continua, e a venda vira reclamação e perda de confiança.',
            melhora: 'Pra cheiro/gosto de cloro, indique o Light Filter (com carvão) ou tratamento no ponto de consumo — e pergunte "faz sentido resolver isso?" antes de enviar proposta.'
          },
          {
            texto: 'Pode ser. Mas olha, dermatologista é quem pode confirmar. Se quiser, tenho umas opções de filtro aqui…',
            adequada: false,
            pontos: 0,
            porque: 'Desvia a autoridade para o médico e enfraquece a própria argumentação.',
            risco: 'Cliente posterga a decisão ("vou ao médico primeiro").',
            melhora: 'Reforce o incômodo real que o cliente relatou (cheiro, pele ressecada) e conduza à Necessidade de solução — indicando o Light Filter ou o ponto de consumo, sem diagnosticar saúde.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     2. Implicação Profunda – "Já acostumei"
     ========================================================= */
  {
    id: 2,
    titulo: 'Implicação Profunda – "Já Acostumei"',
    obrigatorio: true,
    contexto:
      '<p>O cliente minimiza o problema da água: <em>"já acostumei com o gosto"</em>. ' +
      'Seu papel é <strong>amplificar as consequências</strong> sem ser alarmista – ' +
      'saúde, eletrodomésticos, pele, cabelo.</p>',
    passos: [
      {
        fala: 'Ah, a água aqui sempre foi assim. A gente já acostumou com o gosto, nem sente mais.',
        opcoes: [
          {
            texto: 'Entendo que a gente se adapta. Mas me diz: vocês usam essa água pra cozinhar e pro café também? E como está a resistência do chuveiro – troca com frequência?',
            adequada: true,
            pontos: 3,
            porque: 'Validou o sentimento e já iniciou implicação com perguntas sobre impacto real.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Mas acostumar não significa que tá seguro! Água com gosto ruim pode ter metais pesados que causam doenças graves.',
            adequada: false,
            pontos: 0,
            porque: 'Tom alarmista confronta o cliente – gera resistência defensiva.',
            risco: 'Cliente se fecha e encerra a conversa.',
            melhora: 'Valide primeiro ("entendo") e use perguntas para que ele mesmo descubra as consequências.'
          },
          {
            texto: 'Tá certo. Se não incomoda, talvez não precise de filtro mesmo. Mas se mudar de ideia, me liga!',
            adequada: false,
            pontos: 0,
            porque: 'Desiste da venda sem explorar implicações – abandona a oportunidade.',
            risco: 'Perda total do lead; nenhum valor gerado.',
            melhora: 'Use perguntas de implicação para fazer o cliente repensar a gravidade.'
          }
        ]
      },
      {
        fala: 'Cozinhar sim, café também. A resistência do chuveiro troco a cada 3 meses, mais ou menos. Isso tem a ver?',
        opcoes: [
          {
            texto: 'Tem tudo a ver. Cada resistência custa uns R$40, são R$160/ano — e o mesmo desgaste acontece na máquina de lavar, no aquecedor e em tudo que a água toca. E além do bolso: como a sua família percebe essa água no dia a dia, pra beber e cozinhar?',
            adequada: true,
            pontos: 3,
            porque: 'Implicação financeira quantificada (vida útil de resistência e equipamentos) + pergunta aberta que traz a família pra conversa sem alarmismo de saúde.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Sim, água com muito sedimento desgasta a resistência. Nosso filtro resolveria isso.',
            adequada: false,
            pontos: 1,
            porque: 'Confirma mas já salta para a solução – implicação ficou rasa.',
            risco: 'Sem aprofundar, o cliente não sente urgência suficiente.',
            melhora: 'Quantifique o custo anual e conecte a consequência à saúde antes de falar do produto.'
          },
          {
            texto: 'Trocar a cada 3 meses não é normal. O padrão é a cada 12 meses pelo menos.',
            adequada: false,
            pontos: 1,
            porque: 'Dado útil, mas apenas informa – não conecta a implicações maiores.',
            risco: 'Cliente pensa "ok, vou trocar menos" mas não vê necessidade de filtro.',
            melhora: 'Além de informar a frequência normal, calcule o custo acumulado e pergunte sobre impacto na saúde.'
          }
        ]
      },
      {
        fala: 'É, meus filhos bebem direto da torneira sim. Nunca pensei por esse lado… Quanto custa um filtro desses?',
        opcoes: [
          {
            texto: 'Depende da vazão que sua casa precisa, mas o investimento começa em R$3.490 e protege toda a casa – banho, cozinha, máquina de lavar. Se dividir por 60 meses de vida útil, dá menos de R$2 por dia pra família inteira. Posso dimensionar certinho pra você?',
            adequada: true,
            pontos: 3,
            porque: 'Apresenta faixa de preço, âncora de valor (R$2/dia) e pede permissão pra avançar.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Começa em R$3.490. Quer que eu mande a proposta?',
            adequada: false,
            pontos: 1,
            porque: 'Preço sem contexto de valor – parece caro sem a âncora de custo diário.',
            risco: 'Cliente assusta com o valor e diz "vou pensar".',
            melhora: 'Divida pelo tempo de vida útil e mostre o benefício amplo (toda a casa).'
          },
          {
            texto: 'Antes de falar de preço, preciso entender melhor sua casa. Quantos banheiros tem? Qual a pressão da água?',
            adequada: false,
            pontos: 0,
            porque: 'Cliente pediu preço – ignorar gera frustração. Perguntas técnicas neste momento travam o avanço.',
            risco: 'Cliente perde paciência e procura preço na internet.',
            melhora: 'Dê a faixa de preço com âncora de valor e depois faça perguntas de dimensionamento.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     3. Objeção "Tá Caro"
     ========================================================= */
  {
    id: 3,
    titulo: 'Objeção – "Tá Caro"',
    obrigatorio: true,
    contexto:
      '<p>O cliente recebeu a proposta do <strong>Filtro de Entrada (R$5.990)</strong> e diz que está caro. ' +
      'Use o framework: <em>Validar → Isolar → Esclarecer → Minimizar</em>.</p>',
    passos: [
      {
        fala: 'Olha, gostei da explicação, mas R$5.990 tá pesado pro meu bolso. Tá caro.',
        opcoes: [
          {
            texto: 'Entendo perfeitamente, é um investimento importante. Me ajuda a entender: quando você diz "tá caro", é o valor total ou a forma de pagamento que pesa mais?',
            adequada: true,
            pontos: 3,
            porque: 'Validar + Isolar: reconhece o sentimento e separa preço de condição de pagamento.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Mas se você calcular o quanto gasta com manutenção de equipamentos por causa da água, vai ver que se paga!',
            adequada: false,
            pontos: 1,
            porque: 'Tenta minimizar sem antes validar e isolar – parece que está desconsiderando a objeção.',
            risco: 'Cliente sente que não foi ouvido e reforça a posição.',
            melhora: 'Valide primeiro ("entendo"), isole a objeção, e só depois faça a comparação financeira.'
          },
          {
            texto: 'Posso fazer em 12x no cartão, fica R$499 por mês. Fecha?',
            adequada: false,
            pontos: 0,
            porque: 'Pula validação, isolamento e esclarecimento – vai direto ao desconto/parcelamento.',
            risco: 'Se o problema não era a parcela, a objeção real continua sem tratamento.',
            melhora: 'Antes de oferecer parcelamento, descubra se a objeção é sobre valor percebido ou fluxo de caixa.'
          }
        ]
      },
      {
        fala: 'O valor total mesmo. R$5.990 é muito dinheiro de uma vez.',
        opcoes: [
          {
            texto: 'Faz sentido. Deixa eu te mostrar por outro ângulo: esse filtro dura no mínimo 5 anos. São 60 meses, ou seja, menos de R$100/mês – R$3,30 por dia pra proteger a água da casa inteira. Comparando, uma família de 4 gasta facilmente mais que isso por mês entre resistência de chuveiro, manutenção de máquina de lavar e reposição de equipamentos desgastados pela água sem filtro. Faz sentido olhar assim?',
            adequada: true,
            pontos: 3,
            porque: 'Esclarecer + Minimizar: reframing para custo diário e comparação com a manutenção/reposição de equipamentos que o cliente já paga.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Entendo. Infelizmente esse é o preço de tabela, não consigo abaixar.',
            adequada: false,
            pontos: 0,
            porque: 'Fecha a porta sem tentar reframe de valor – parece intransigente.',
            risco: 'Cliente agradece e desliga.',
            melhora: 'Minimize dividindo por dias de uso e compare com gastos que ele já tem (manutenção e reposição de equipamentos).'
          },
          {
            texto: 'Temos um modelo mais simples por R$3.490, se preferir.',
            adequada: false,
            pontos: 1,
            porque: 'Oferece downgrade sem esclarecer valor – reduz ticket sem necessidade.',
            risco: 'Se o modelo de R$5.990 era o adequado, o cliente fica subdimensionado.',
            melhora: 'Antes de oferecer opção mais barata, tente o reframe de valor (custo por dia). Se não funcionar, aí sim apresente alternativa.'
          }
        ]
      },
      {
        fala: 'R$3,30 por dia… desse jeito faz mais sentido. Mas ainda preciso encaixar no orçamento.',
        opcoes: [
          {
            texto: 'Claro! Parcelamos em até 12x sem juros no cartão – fica R$499/mês. E se preferir boleto, fazemos em 3x de R$1.997. Qual forma se encaixa melhor pra você?',
            adequada: true,
            pontos: 3,
            porque: 'Oferece opções concretas e pergunta fechada (qual, não se) – facilita a decisão.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Parcelamos em até 12x. Quer fechar?',
            adequada: false,
            pontos: 1,
            porque: 'Certo na opção de parcelamento, mas "quer fechar?" é abrupto – sem alternativa de boleto.',
            risco: 'Se o cliente não tem cartão com limite, trava a negociação.',
            melhora: 'Ofereça cartão e boleto como opções e use pergunta "qual se encaixa melhor?".'
          },
          {
            texto: 'Posso segurar esse preço até sexta. Depois disso, não garanto a mesma condição.',
            adequada: false,
            pontos: 0,
            porque: 'Pressão artificial de prazo sem oferecer solução de pagamento – gera desconfiança.',
            risco: 'Cliente percebe a tática e perde confiança.',
            melhora: 'Resolva a dor do orçamento com opções de parcelamento antes de criar urgência.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     4. Objeção "Vou Pensar"
     ========================================================= */
  {
    id: 4,
    titulo: 'Objeção – "Vou Pensar"',
    obrigatorio: true,
    contexto:
      '<p>Após a apresentação completa, o cliente diz <em>"vou pensar"</em>. ' +
      'Objetivo: conseguir um <strong>micro-compromisso</strong> – agendar retorno com data e hora.</p>',
    passos: [
      {
        fala: 'Achei bem interessante. Deixa eu pensar com calma e te dou um retorno, tá?',
        opcoes: [
          {
            texto: 'Claro, faz todo sentido pensar com calma. Só pra eu te ajudar nessa reflexão: tem algum ponto específico que ficou em dúvida ou que gostaria que eu esclarecesse?',
            adequada: true,
            pontos: 3,
            porque: 'Valida e tenta descobrir a objeção real por trás do "vou pensar".',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Ok, sem problema! Quando puder, me liga. Meu WhatsApp tá aberto.',
            adequada: false,
            pontos: 0,
            porque: 'Aceita passivamente – sem micro-compromisso, o lead esfria e não retorna.',
            risco: 'Perda do lead. Estatisticamente, 80% dos "vou pensar" nunca retornam sem follow-up agendado.',
            melhora: 'Antes de encerrar, investigue a dúvida real e proponha uma data de retorno.'
          },
          {
            texto: 'Olha, essa condição especial é só até amanhã, viu?',
            adequada: false,
            pontos: 0,
            porque: 'Pressão de escassez falsa – gera desconfiança e não resolve a objeção real.',
            risco: 'Cliente se sente pressionado e bloqueia o contato.',
            melhora: 'Descubra o que realmente precisa ser "pensado" antes de usar qualquer gatilho.'
          }
        ]
      },
      {
        fala: 'Não, ficou tudo claro. É mais questão de organizar as finanças mesmo.',
        opcoes: [
          {
            texto: 'Perfeito, é justo organizar. Que tal o seguinte: eu te ligo quinta às 14h pra gente retomar? Assim você tem tempo de ver o orçamento e eu posso tirar qualquer dúvida que surgir. Funciona pra você?',
            adequada: true,
            pontos: 3,
            porque: 'Micro-compromisso com data e hora específicos. Dá razão para o retorno (tirar dúvidas).',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Entendo. Quando achar que é a hora, pode me chamar no WhatsApp.',
            adequada: false,
            pontos: 0,
            porque: 'De novo, sem data nem hora – o retorno fica vago e improvável.',
            risco: 'Lead perdido sem follow-up estruturado.',
            melhora: 'Proponha dia e horário específicos para o retorno.'
          },
          {
            texto: 'Posso parcelar em 12x sem juros pra facilitar. Fecha agora?',
            adequada: false,
            pontos: 1,
            porque: 'Tenta resolver a objeção financeira, mas o tom "fecha agora?" é pressão excessiva.',
            risco: 'Cliente que pediu tempo se sente acuado.',
            melhora: 'Mencione o parcelamento como opção, mas proponha retorno agendado em vez de pressionar fechamento imediato.'
          }
        ]
      },
      {
        fala: 'Quinta às 14h pode ser. Anota aí.',
        opcoes: [
          {
            texto: 'Anotado! Quinta, 14h, te ligo. Vou te mandar um resumo por WhatsApp com os pontos que conversamos pra facilitar sua análise. Obrigado pela confiança!',
            adequada: true,
            pontos: 3,
            porque: 'Confirma o compromisso, agrega valor enviando resumo e fecha com cordialidade.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Beleza, quinta te ligo. Até!',
            adequada: false,
            pontos: 1,
            porque: 'Confirma mas perde a chance de enviar material de apoio que reforça valor.',
            risco: 'Sem resumo/material, o cliente pode esquecer os argumentos até quinta.',
            melhora: 'Envie um resumo dos benefícios por WhatsApp para manter o lead aquecido.'
          },
          {
            texto: 'Perfeito. E se antes de quinta você decidir, é só me chamar que fecho na hora!',
            adequada: false,
            pontos: 1,
            porque: 'Ansiedade de fechamento transparece – enfraquece a posição consultiva.',
            risco: 'Demonstra desespero e reduz credibilidade.',
            melhora: 'Foque em agregar valor (enviar resumo, artigo) em vez de insistir no fechamento.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     5. Objeção "Falar com Esposa"
     ========================================================= */
  {
    id: 5,
    titulo: 'Objeção – "Preciso Falar com Minha Esposa"',
    obrigatorio: true,
    contexto:
      '<p>O cliente gostou, mas diz que precisa consultar a esposa. ' +
      'Objetivo: <strong>oferecer uma call conjunta de 10 minutos</strong> para incluir o decisor.</p>',
    passos: [
      {
        fala: 'Cara, eu gostei bastante, mas preciso falar com minha esposa antes. Ela que cuida dessas decisões maiores.',
        opcoes: [
          {
            texto: 'Entendo completamente, decisão de casa tem que ser em conjunto. O que acha de a gente fazer uma call rápida de 10 minutos com ela? Assim eu explico os pontos principais e vocês decidem juntos, sem que você precise virar o "vendedor" em casa.',
            adequada: true,
            pontos: 3,
            porque: 'Valida a dinâmica do casal e oferece solução prática que inclui o decisor.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Sem problema! Fala com ela e me retorna quando puder.',
            adequada: false,
            pontos: 0,
            porque: 'Aceita passivamente. O cliente vai tentar explicar, não vai conseguir transmitir o valor, e a esposa vai vetar.',
            risco: 'Perda do negócio – o cliente não tem os argumentos técnicos pra convencer.',
            melhora: 'Ofereça uma call conjunta curta para que você apresente diretamente ao decisor.'
          },
          {
            texto: 'Posso mandar um vídeo explicativo pra você mostrar pra ela?',
            adequada: false,
            pontos: 1,
            porque: 'Melhor que nada, mas vídeo genérico não responde dúvidas específicas da esposa.',
            risco: 'A esposa assiste parcialmente e não se convence.',
            melhora: 'Vídeo pode complementar, mas a call ao vivo de 10 min é muito mais efetiva.'
          }
        ]
      },
      {
        fala: 'Uma call? Pode ser, mas ela tem pouco tempo. Trabalha o dia todo.',
        opcoes: [
          {
            texto: 'Perfeito, por isso pensei em algo rápido – 10 minutinhos. Pode ser no horário de almoço ou à noite, o que for melhor pra ela. Qual horário ela costuma estar mais tranquila?',
            adequada: true,
            pontos: 3,
            porque: 'Reforça que é curto (10 min), oferece flexibilidade e pergunta pelo melhor horário.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'É rapidinho, prometo! Passa o número dela que eu ligo direto.',
            adequada: false,
            pontos: 0,
            porque: 'Pedir o número direto é invasivo – o marido precisa intermediar o contato.',
            risco: 'Cliente se incomoda com a abordagem direta à esposa.',
            melhora: 'Deixe o cliente mediar. Pergunte qual horário funciona para os dois.'
          },
          {
            texto: 'Então talvez por mensagem de áudio? Eu gravo explicando tudo.',
            adequada: false,
            pontos: 1,
            porque: 'Criativo, mas áudio não permite interação – dúvidas da esposa ficam sem resposta.',
            risco: 'Áudio longo é ignorado. Sem interação, objeções da esposa não são tratadas.',
            melhora: 'Priorize a call ao vivo. Áudio pode ser backup se a call não rolar de jeito nenhum.'
          }
        ]
      },
      {
        fala: 'Acho que à noite funciona. Depois das 20h geralmente ela tá mais tranquila.',
        opcoes: [
          {
            texto: 'Ótimo! Que tal amanhã às 20h30? Eu ligo por vídeo no WhatsApp, apresento os pontos principais em 10 minutos e vocês tiram todas as dúvidas juntos. Funciona?',
            adequada: true,
            pontos: 3,
            porque: 'Data, hora e canal definidos. Vídeo gera mais conexão e confiança.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Beleza, à noite então. Quando vocês tiverem um tempinho, me avisa.',
            adequada: false,
            pontos: 0,
            porque: 'Vago – sem data e hora, o agendamento não acontece.',
            risco: 'O casal nunca "acha" o tempinho e o lead morre.',
            melhora: 'Defina dia, horário e canal (WhatsApp vídeo) agora.'
          },
          {
            texto: 'Amanhã às 20h30 eu ligo. Só peço que ela dê uma olhada no material que vou enviar antes.',
            adequada: false,
            pontos: 1,
            porque: 'Agenda a call, mas pedir "dever de casa" pode criar atrito.',
            risco: 'Se a esposa não lê o material, o vendedor se frustra e ela se sente cobrada.',
            melhora: 'Agende a call sem pré-requisitos. Você apresenta tudo ao vivo.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     6. Objeção "Achei Mais Barato na Internet"
     ========================================================= */
  {
    id: 6,
    titulo: 'Objeção – "Achei Mais Barato na Internet"',
    obrigatorio: true,
    contexto:
      '<p>O cliente diz que encontrou um filtro parecido mais barato online. ' +
      'Diferenciais TDF: <strong>inox 304 (não 201)</strong>, instalação profissional própria (item da proposta, R$ 590), ' +
      'garantia de 5 anos, pós-venda com suporte técnico.</p>',
    passos: [
      {
        fala: 'Vi na internet um filtro de inox parecido com o de vocês por R$2.800. Por que o de vocês custa R$5.990?',
        opcoes: [
          {
            texto: 'Boa pergunta! Realmente, à primeira vista parece similar. Me deixa te mostrar 3 diferenças que impactam direto na durabilidade e na sua saúde. Primeiro: você sabe qual o tipo de inox desse filtro que viu?',
            adequada: true,
            pontos: 3,
            porque: 'Valida a comparação e inicia diferenciação técnica com pergunta.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Nosso produto é premium, não dá pra comparar com esses genéricos da internet.',
            adequada: false,
            pontos: 0,
            porque: 'Tom arrogante que desqualifica a pesquisa do cliente – gera antipatia.',
            risco: 'Cliente se ofende e compra o concorrente por birra.',
            melhora: 'Reconheça a pesquisa do cliente e diferencie com fatos técnicos, não com julgamento.'
          },
          {
            texto: 'O nosso é inox 304, que é cirúrgico. O da internet provavelmente é 201.',
            adequada: false,
            pontos: 1,
            porque: 'Informação correta, mas jogar dado técnico sem contexto não gera impacto.',
            risco: 'Cliente não sabe a diferença entre 304 e 201 e acha que é desculpa pra cobrar mais.',
            melhora: 'Explique o impacto prático: 304 não enferruja, 201 oxida em 2-3 anos e contamina a água.'
          }
        ]
      },
      {
        fala: 'Não sei o tipo de inox, não. Só sei que é inox e parecia igual.',
        opcoes: [
          {
            texto: 'A maioria dos filtros baratos usa inox 201, que oxida em 2-3 anos – literalmente enferruja por dentro e contamina a água que deveria filtrar. O nosso é inox 304, o mesmo usado em equipamentos hospitalares, garantia de 5 anos. Além disso, na nossa proposta a instalação profissional entra como item próprio (R$ 590) — feita pela nossa equipe, com bypass e teste de vazão — e você tem suporte pós-venda. O da internet, quanto você vai gastar pra contratar um instalador por fora?',
            adequada: true,
            pontos: 3,
            porque: 'Diferenciação clara: material + consequência + instalação profissional como item de valor na proposta + pergunta que evidencia o custo oculto do concorrente.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Inox 201 enferruja. O nosso é 304. E a gente ainda instala.',
            adequada: false,
            pontos: 1,
            porque: 'Informação correta mas telegráfica – não gera impacto emocional.',
            risco: 'Cliente pensa "tá, mas R$3.000 de diferença por causa do inox?".',
            melhora: 'Descreva a consequência (ferrugem contamina a água) e some os custos ocultos do concorrente.'
          },
          {
            texto: 'Se quiser, posso igualar o preço deles.',
            adequada: false,
            pontos: 0,
            porque: 'Baixar preço sem justificativa destrói margem e credibilidade.',
            risco: 'Se você iguala, o cliente pensa "então sempre podia ser mais barato" e perde confiança.',
            melhora: 'Nunca iguale preço de concorrente inferior. Diferencie pelo valor agregado.'
          }
        ]
      },
      {
        fala: 'Não, o da internet não inclui instalação. E a garantia era de 1 ano só.',
        opcoes: [
          {
            texto: 'Então veja: somando instalação (R$590 em média) e a diferença de garantia (1 ano vs 5 anos), o custo real do concorrente se aproxima bastante. Só que com material inferior e sem suporte pós-venda. Faz sentido investir um pouco mais pra ter tranquilidade por 5 anos?',
            adequada: true,
            pontos: 3,
            porque: 'Equalização de custos + pergunta de fechamento consultivo.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Pois é, no final sai quase o mesmo preço e o nosso é muito melhor.',
            adequada: false,
            pontos: 1,
            porque: 'Conclusão correta, mas afirmativa em vez de consultiva – não engaja o cliente na decisão.',
            risco: 'Cliente sente que está sendo "convencido" em vez de decidir por conta própria.',
            melhora: 'Use pergunta: "Faz sentido investir um pouco mais pra ter 5 anos de tranquilidade?"'
          },
          {
            texto: 'E quando der problema, quem você vai ligar? A loja online não manda técnico na sua casa.',
            adequada: false,
            pontos: 1,
            porque: 'Argumento válido mas tom combativo – parece que está atacando a outra empresa.',
            risco: 'Cliente pode interpretar como medo da concorrência.',
            melhora: 'Foque nos diferenciais positivos da TDF em vez de atacar o concorrente.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     7. Cliente Irritado – Água Amarela
     ========================================================= */
  {
    id: 7,
    titulo: 'Cliente Irritado – Água Amarela há 3 Meses',
    obrigatorio: true,
    contexto:
      '<p>O cliente está <strong>irritado</strong>: a água sai amarela há 3 meses e ele já ligou antes sem solução. ' +
      'Regra de ouro: <em>empatia antes de solução</em>. Só apresente o produto depois de acolher.</p>',
    passos: [
      {
        fala: 'Cara, eu já liguei aí duas vezes e ninguém resolveu! Faz 3 meses que a água sai amarela, minhas roupas estão manchadas, estou MUITO irritado!',
        opcoes: [
          {
            texto: 'Eu entendo sua frustração e você tem toda razão de estar chateado. Água amarela por 3 meses é inaceitável, e sinto muito que sua experiência até agora não tenha sido boa. Me dá 5 minutos pra entender exatamente o que aconteceu e encontrar a melhor solução pra você?',
            adequada: true,
            pontos: 3,
            porque: 'Empatia genuína + validação + pedido de permissão para resolver. Não tenta vender nada ainda.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Calma, senhor. Vou verificar no sistema o que aconteceu nas ligações anteriores.',
            adequada: false,
            pontos: 1,
            porque: '"Calma" invalida a emoção do cliente. Verificar no sistema é bom, mas sem empatia primeiro.',
            risco: 'Cliente fica mais irritado ao ouvir "calma".',
            melhora: 'Nunca diga "calma". Valide o sentimento: "entendo sua frustração, tem razão".'
          },
          {
            texto: 'Água amarela indica presença de ferro. Nosso sistema Iron Free resolve isso. Posso explicar?',
            adequada: false,
            pontos: 0,
            porque: 'Ignorou completamente a emoção – partiu pra venda com cliente furioso.',
            risco: 'Cliente desliga ou deixa avaliação negativa.',
            melhora: 'Primeiro acolha, depois diagnostique, e só então apresente solução.'
          }
        ]
      },
      {
        fala: 'Pelo menos alguém que me ouve! É, a água sai marrom de manhã e amarela o resto do dia. Já perdi 3 camisas brancas.',
        opcoes: [
          {
            texto: 'Puxa, 3 camisas é prejuízo real. E imagino que além das roupas, o chuveiro, a louça, tudo sofre, né? Me conta: você sabe se a água vem de poço ou da rede pública? Isso muda o tipo de tratamento.',
            adequada: true,
            pontos: 3,
            porque: 'Valida o prejuízo, amplia o impacto e inicia diagnóstico técnico naturalmente.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Isso é ferro dissolvido na água. É bem comum em algumas regiões. Temos o Iron Free que remove até 99,7% do ferro.',
            adequada: false,
            pontos: 1,
            porque: 'Diagnóstico técnico correto, mas ainda é cedo – faltou validar os prejuízos do cliente.',
            risco: 'Cliente sente que você está mais interessado em vender do que em ajudar.',
            melhora: 'Reconheça o prejuízo das camisas, amplie o impacto e só depois entre na parte técnica.'
          },
          {
            texto: 'Você já tentou ligar pra Sabesp? Às vezes o problema é da rede.',
            adequada: false,
            pontos: 0,
            porque: 'Transfere a responsabilidade – o cliente quer solução, não mais burocracia.',
            risco: 'Cliente acha que você está se esquivando.',
            melhora: 'Mesmo que seja problema da rede, foque na solução que VOCÊ pode oferecer.'
          }
        ]
      },
      {
        fala: 'É poço artesiano. O vizinho tem o mesmo problema.',
        opcoes: [
          {
            texto: 'Água de poço com ferro é um dos casos que mais atendemos. A solução definitiva é o sistema Iron Free – ele oxida e filtra o ferro antes de entrar na casa. Investimento a partir de R$13.990, com garantia de 5 anos. O próximo passo é a visita técnica + análise da água (R$ 800), que entra como parte do seu projeto – o valor é abatido na proposta. Quer que eu agende pra essa semana?',
            adequada: true,
            pontos: 3,
            porque: 'Agora sim apresenta a solução – depois de acolher. Oferece a visita técnica + análise como próximo passo concreto, posicionada como parte do projeto (abatida na proposta), nunca como "gratuita".',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Nosso Iron Free custa a partir de R$13.990. Posso mandar a proposta?',
            adequada: false,
            pontos: 1,
            porque: 'Preço sem contexto de valor e sem visita técnica – parece genérico.',
            risco: 'Cliente assusta com o preço sem entender o que compõe a solução.',
            melhora: 'Ofereça a visita técnica + análise (R$ 800, que entra como parte do projeto e é abatida na proposta) como próximo passo – gera compromisso e permite dimensionar.'
          },
          {
            texto: 'Complicado, poço com ferro precisa de análise. Vou passar pro nosso técnico e ele te liga. Pode ser?',
            adequada: false,
            pontos: 0,
            porque: 'Transferir para técnico depois de 2 tentativas frustradas é repetir o padrão que irritou o cliente.',
            risco: 'Cliente pensa "de novo vão me empurrar pra outra pessoa".',
            melhora: 'Conduza você a conversa e agende a visita técnica diretamente – seja o ponto focal.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     8. Cliente Analítico – Perfil Conforme/DISC
     ========================================================= */
  {
    id: 8,
    titulo: 'Cliente Analítico – Perfil Conforme (DISC)',
    obrigatorio: true,
    contexto:
      '<p>O cliente tem perfil <strong>Conforme (C) no DISC</strong>: quer dados, laudos, especificações técnicas. ' +
      'Não responde a apelos emocionais – precisa de <em>evidências e lógica</em>.</p>',
    passos: [
      {
        fala: 'Antes de qualquer coisa: vocês têm laudo de eficiência do filtro? Quero ver os números de retenção de partículas e a vazão real, não a nominal.',
        opcoes: [
          {
            texto: 'Claro. Tenho aqui a ficha técnica oficial, com os índices de retenção por micragem e a vazão real medida — não só a nominal — de cada modelo [conforme ficha técnica oficial]. Posso te enviar o PDF agora com os números exatos do modelo indicado pro seu caso?',
            adequada: true,
            pontos: 3,
            porque: 'Responde com documentação oficial (ficha técnica), diferencia vazão real vs nominal e oferece o documento na hora — sem inventar números.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Nosso filtro é o melhor do mercado! Milhares de clientes satisfeitos. Posso te mandar depoimentos?',
            adequada: false,
            pontos: 0,
            porque: 'Apelo emocional e prova social não funcionam com perfil Conforme – ele quer dados, não opiniões.',
            risco: 'Cliente perde credibilidade em você e procura outro fornecedor.',
            melhora: 'Para perfil C, apresente laudos, números e especificações técnicas objetivas.'
          },
          {
            texto: 'Temos sim! A eficiência é altíssima. Vou procurar a ficha técnica e te envio.',
            adequada: false,
            pontos: 1,
            porque: '"Altíssima" é vago pro perfil C. E "vou procurar" mostra que não está preparado.',
            risco: 'Cliente questiona sua preparação e credibilidade técnica.',
            melhora: 'Tenha a ficha técnica oficial à mão e os números exatos do modelo na ponta da língua.'
          }
        ]
      },
      {
        fala: 'Ok, manda o PDF. E o material do corpo do filtro? Quero saber a especificação da liga metálica.',
        opcoes: [
          {
            texto: 'O corpo é em aço inoxidável AISI 304 — liga 18/8 (18% cromo e 8% níquel), reconhecida pela resistência à corrosão. Espessura, acabamento e demais especificações do corpo estão detalhados na ficha técnica oficial [conforme ficha técnica oficial], que vou te enviar completa.',
            adequada: true,
            pontos: 3,
            porque: 'Nomenclatura técnica correta (AISI 304, liga 18/8) + compromisso com a ficha técnica oficial – exatamente o que o perfil C quer, sem inventar números.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'É inox 304, o melhor inox disponível. Não enferruja nunca.',
            adequada: false,
            pontos: 1,
            porque: '"Melhor" e "nunca" são superlativos que o analítico desconfia. Faltou composição e espessura.',
            risco: 'Cliente pensa que você não conhece o produto a fundo.',
            melhora: 'Especifique: AISI 304, liga 18/8 (cromo/níquel) e envie a ficha técnica oficial completa.'
          },
          {
            texto: 'É inox cirúrgico, de altíssima qualidade. Pode confiar!',
            adequada: false,
            pontos: 0,
            porque: '"Inox cirúrgico" é marketing, não dado técnico. "Pode confiar" não é argumento pra perfil C.',
            risco: 'Credibilidade destruída – cliente vai pesquisar por conta e comprar em outro lugar.',
            melhora: 'Use a nomenclatura técnica (AISI 304), cite composição e envie ficha técnica.'
          }
        ]
      },
      {
        fala: 'Interessante. Última coisa: qual o custo total de propriedade em 5 anos, incluindo manutenção e troca de elementos filtrantes?',
        opcoes: [
          {
            texto: 'Boa pergunta. No custo total de propriedade do modelo de R$5.990 entram três componentes: o equipamento (R$ 5.990), a instalação profissional (R$ 590, item da proposta) e as trocas periódicas do elemento filtrante, cujo valor e periodicidade estão na ficha técnica oficial [conforme ficha técnica oficial]. Posso montar uma planilha com esses valores abertos, ano a ano, comparando com o custo de manutenção de eletrodomésticos sem filtro?',
            adequada: true,
            pontos: 3,
            porque: 'TCO com componentes abertos (equipamento + instalação + manutenção pela ficha técnica) + oferta de planilha comparativa. Perfil C ama planilhas.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Manutenção é bem baixa. Uma troca de refil por ano e pronto. É muito econômico.',
            adequada: false,
            pontos: 0,
            porque: 'Resposta vaga e qualitativa – perfil C perguntou custo total, quer números exatos.',
            risco: 'Cliente desiste por falta de informação concreta.',
            melhora: 'Calcule: preço + instalação + (refil × anos) = TCO total e mensal.'
          },
          {
            texto: 'Somando equipamento, instalação e manutenção, em 5 anos fica na casa dos R$ 8 mil. É um investimento que se paga.',
            adequada: false,
            pontos: 1,
            porque: 'Número aproximado sem breakdown – perfil C quer ver cada componente.',
            risco: 'Parece que o número foi inventado sem detalhamento.',
            melhora: 'Decomponha: equipamento + instalação + manutenção anual × 5. Ofereça planilha.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     9. Fechamento com Urgência Real
     ========================================================= */
  {
    id: 9,
    titulo: 'Fechamento – Urgência Real (Equipe na Região)',
    obrigatorio: true,
    contexto:
      '<p>A equipe de instalação estará na região do cliente <strong>esta semana</strong>. ' +
      'Essa é uma urgência real (não fabricada). Use para facilitar o fechamento.</p>',
    passos: [
      {
        fala: 'Gostei da proposta. Mas não sei se consigo decidir agora…',
        opcoes: [
          {
            texto: 'Entendo que é uma decisão importante. Queria te contar uma coisa: nossa equipe de instalação vai estar na sua região esta semana – normalmente a agenda deles é com 15-20 dias de espera. Se fecharmos até quarta, consigo encaixar sua instalação já nesta sexta. Faz sentido aproveitar essa janela?',
            adequada: true,
            pontos: 3,
            porque: 'Urgência real e verificável – equipe na região. Dá prazo concreto (quarta) e benefício claro (instala sexta).',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Essa promoção é só até hoje! Amanhã o preço volta ao normal.',
            adequada: false,
            pontos: 0,
            porque: 'Escassez fabricada – se o cliente descobre que não é verdade, perde toda a confiança.',
            risco: 'Destruição de credibilidade. Se voltar amanhã e o preço for o mesmo, nunca mais compra.',
            melhora: 'Use apenas urgências reais: equipe na região, estoque limitado de um modelo, etc.'
          },
          {
            texto: 'Sem pressa! Quando você decidir, a gente agenda a instalação.',
            adequada: false,
            pontos: 1,
            porque: 'Sem urgência nenhuma – perde oportunidade legítima de facilitar a decisão.',
            risco: 'Cliente posterga indefinidamente.',
            melhora: 'Informe sobre a equipe na região – é uma conveniência real para o cliente, não pressão.'
          }
        ]
      },
      {
        fala: 'Sexta já? Isso seria ótimo porque fico em casa às sextas. Mas como funciona a instalação?',
        opcoes: [
          {
            texto: 'Perfeito! A instalação leva de 2 a 3 horas. Nossa equipe chega com todo o material, faz o corte na tubulação, instala o filtro com bypass (pra você não ficar sem água durante manutenção futura), testa a vazão e deixa tudo funcionando. A instalação (R$ 590) entra como item na sua proposta — e como a equipe já estará na sua região, se fecharmos pra essa sexta eu consigo bonificar ela no fechamento. Alguma dúvida sobre o processo?',
            adequada: true,
            pontos: 3,
            porque: 'Detalhamento completo do processo + instalação como item de valor (R$ 590), bonificada no fechamento com justificativa logística real + pergunta aberta.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'É tranquilo, a equipe cuida de tudo. Não precisa se preocupar.',
            adequada: false,
            pontos: 1,
            porque: 'Vago demais – cliente quer saber o que vai acontecer na casa dele.',
            risco: 'Falta de informação gera insegurança e pode travar o fechamento.',
            melhora: 'Descreva: duração, o que será feito, bypass, teste de vazão, e o valor da instalação (R$ 590) como item da proposta — bonificável só no fechamento.'
          },
          {
            texto: 'A instalação é simples. Só preciso confirmar se você tem ponto de água acessível.',
            adequada: false,
            pontos: 1,
            porque: 'Pergunta técnica válida, mas não descreve o processo completo que o cliente pediu.',
            risco: 'Cliente fica com dúvidas não respondidas.',
            melhora: 'Explique o processo completo primeiro, depois faça perguntas técnicas de pré-instalação.'
          }
        ]
      },
      {
        fala: 'Tá claro. Vamos fazer! Como eu pago?',
        opcoes: [
          {
            texto: 'Ótima decisão! Temos 3 formas: cartão de crédito em até 12x sem juros, PIX à vista, ou boleto em 3x. Qual funciona melhor pra você? Assim que confirmar o pagamento, já reservo o horário da sexta com a equipe.',
            adequada: true,
            pontos: 3,
            porque: 'Celebra a decisão, apresenta opções claras de pagamento (sem mexer no preço do produto) e conecta o pagamento à reserva da instalação.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Aceito cartão, PIX ou boleto. Me passa seus dados que gero o link.',
            adequada: false,
            pontos: 1,
            porque: 'Funcional, mas sem detalhamento das condições (parcelas, prazos) e sem celebrar a decisão.',
            risco: 'Cliente fica sem saber as condições de cada forma – informação que deveria vir proativamente.',
            melhora: 'Detalhe as condições de cada forma de pagamento proativamente – lembrando que o preço do produto não muda.'
          },
          {
            texto: 'Vou gerar um boleto e te envio por WhatsApp. Vencimento pra amanhã, tá?',
            adequada: false,
            pontos: 0,
            porque: 'Escolheu a forma de pagamento pelo cliente e deu prazo apertado – restringe opções.',
            risco: 'Cliente pode preferir cartão ou PIX. Boleto pra amanhã soa pressão.',
            melhora: 'Apresente todas as opções e deixe o cliente escolher.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     10. Follow-up D+3
     ========================================================= */
  {
    id: 10,
    titulo: 'Follow-up D+3 – Proposta Sem Resposta',
    obrigatorio: true,
    contexto:
      '<p>O cliente recebeu a proposta há 3 dias e <strong>não respondeu</strong>. ' +
      'Objetivo: <em>agregar valor</em> na abordagem de follow-up, não apenas cobrar retorno.</p>',
    passos: [
      {
        fala: '(Você liga para o cliente. Ele atende.)',
        opcoes: [
          {
            texto: 'Oi João, tudo bem? Aqui é o Carlos da Tudo de Filtro. Lembrei de você porque instalamos mês passado pra um cliente da sua região com exatamente o mesmo quadro que você me descreveu — água de poço saindo amarelada. Achei que valia te contar como ficou. Posso te contar em 2 minutos?',
            adequada: true,
            pontos: 3,
            porque: 'Agrega valor com prova social verdadeira e relevante (caso real da região). Não cobra resposta da proposta – gera interesse natural.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Oi João, tudo bem? Tô ligando pra saber se viu a proposta que enviei na terça. Teve chance de analisar?',
            adequada: false,
            pontos: 1,
            porque: 'Cobrança direta – não agrega valor e coloca o cliente na defensiva.',
            risco: 'Cliente se sente cobrado e diz "ainda não vi" ou "não decidi".',
            melhora: 'Abra com valor novo (caso real de cliente, novidade, informação útil) antes de mencionar a proposta.'
          },
          {
            texto: 'Oi João! Só passando pra avisar que o preço da proposta é válido só até sexta, tá?',
            adequada: false,
            pontos: 0,
            porque: 'Pressão de prazo no follow-up sem nenhum valor agregado.',
            risco: 'Se o prazo for artificial, destrói confiança. Se for real, deveria ter sido dito antes.',
            melhora: 'Traga informação nova que reforce o valor. A urgência, se real, vem no final.'
          }
        ]
      },
      {
        fala: 'Ah, oi Carlos! Pode falar, sim. Que caso é esse?',
        opcoes: [
          {
            texto: 'É um cliente aqui da sua região, também com poço e água amarelada por causa do ferro. Instalamos o sistema na entrada da casa mês passado e hoje a água sai limpa — acabaram as roupas e louças manchadas. Lembra que sua água sai amarelada? É exatamente esse cenário. Inclusive, revendo sua proposta, acho que vale a gente conversar sobre o dimensionamento. Ficou alguma dúvida desde a nossa última conversa?',
            adequada: true,
            pontos: 3,
            porque: 'Conecta o caso real ao problema do cliente, reforça a solução com prova social verdadeira e retoma a proposta naturalmente.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'É um cliente que tinha problema com poço. Mas enfim, e a proposta? Vai rolar?',
            adequada: false,
            pontos: 0,
            porque: 'O caso virou pretexto raso pra cobrar a proposta – cliente percebe a manipulação.',
            risco: 'Perda de credibilidade e confiança.',
            melhora: 'Descreva o caso com detalhes reais (problema, solução, resultado) e conecte à situação do cliente.'
          },
          {
            texto: 'Vou te mandar as fotos do antes e depois por WhatsApp. Dá uma olhada quando puder e me diz o que achou!',
            adequada: false,
            pontos: 1,
            porque: 'Delega a ação pro cliente sem conduzir. Bom enviar as fotos, mas precisa conectar ao caso dele.',
            risco: 'Cliente não olha o material e o follow-up não avança.',
            melhora: 'Resuma o resultado do caso, conecte ao problema dele e retome a conversa da proposta.'
          }
        ]
      },
      {
        fala: 'É, faz sentido. Na verdade eu ia te ligar essa semana. A dúvida é se preciso mesmo do modelo maior ou se o básico resolve.',
        opcoes: [
          {
            texto: 'Ótima pergunta. Vamos recapitular: sua casa tem 3 banheiros, 5 moradores e poço com ferro alto. Pro dimensionamento correto, o modelo de 2.000 L/h garante vazão confortável sem queda de pressão. O modelo básico de 1.000 L/h funcionaria, mas nos horários de pico – banho da manhã, por exemplo – você sentiria diferença. A diferença de investimento é de R$1.500, mas a experiência muda bastante. Quer que eu faça uma comparação lado a lado?',
            adequada: true,
            pontos: 3,
            porque: 'Retomou dados do briefing, justificou tecnicamente e ofereceu comparativo – sem empurrar o mais caro.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'O maior é sempre melhor! Vai de 2.000 L/h que você não se arrepende.',
            adequada: false,
            pontos: 0,
            porque: 'Empurra o mais caro sem justificativa técnica – perde consultividade.',
            risco: 'Cliente sente que está sendo direcionado pro produto mais caro.',
            melhora: 'Justifique com dados: número de banheiros, moradores, vazão de pico.'
          },
          {
            texto: 'Depende do uso. Quantos banheiros tem na casa?',
            adequada: false,
            pontos: 1,
            porque: 'Pergunta válida, mas essa informação já foi coletada na primeira conversa. Refazer mostra que não tomou nota.',
            risco: 'Cliente pensa que você não se lembra dele – atendimento despersonalizado.',
            melhora: 'Retome os dados que já tem ("sua casa tem 3 banheiros, certo?") e dimensione.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     11. Upsell – Scale Stop Combo
     ========================================================= */
  {
    id: 11,
    titulo: 'Upsell – Scale Stop após Fechamento do Filtro de Entrada',
    obrigatorio: true,
    contexto:
      '<p>O cliente acabou de fechar o <strong>Filtro de Entrada</strong>. Agora é hora de oferecer o ' +
      '<strong>Scale Stop</strong> como complemento. Preço do produto é fixo — a vantagem de fechar junto é logística: ' +
      'uma visita só e a instalação do segundo equipamento bonificada no fechamento. ' +
      'Scale Stop: anti-incrustação, protege aquecedores, chuveiros, máquina de lavar.</p>',
    passos: [
      {
        fala: 'Pronto, fechado o Filtro de Entrada então! Fico feliz. Quando instalam?',
        opcoes: [
          {
            texto: 'Instalação na próxima semana! E já que estamos resolvendo a qualidade da água, quero te fazer uma pergunta: vocês usam aquecedor a gás ou elétrico?',
            adequada: true,
            pontos: 3,
            porque: 'Confirma prazo e inicia sondagem natural para o Scale Stop sem parecer que está empurrando produto.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Ótimo! E aproveitando, tenho o Scale Stop que é o complemento perfeito, por R$8.990. Se fechar junto, a instalação dele sai bonificada. Quer adicionar?',
            adequada: false,
            pontos: 1,
            porque: 'Oferta direta sem sondagem – cliente não entendeu por que precisaria.',
            risco: 'Parece venda agressiva logo após o fechamento. Cliente se arrepende do que já comprou.',
            melhora: 'Faça sondagem primeiro (tipo de aquecedor, problemas com calcário) antes de oferecer.'
          },
          {
            texto: 'Instalação semana que vem! Qualquer dúvida, me chama. Obrigado!',
            adequada: false,
            pontos: 0,
            porque: 'Encerra sem explorar oportunidade de upsell legítima.',
            risco: 'Receita deixada na mesa. O cliente poderia se beneficiar do Scale Stop.',
            melhora: 'Após o fechamento é o melhor momento para upsell – o cliente está comprometido e aberto.'
          }
        ]
      },
      {
        fala: 'Temos aquecedor a gás. Por quê?',
        opcoes: [
          {
            texto: 'Porque aquecedor a gás é um dos equipamentos que mais sofre com calcário – a água dura forma uma crosta dentro da serpentina e reduz a eficiência. Em muitos casos, o aquecedor perde até 30% de potência em 2 anos. Você já percebeu se a água quente demora mais pra esquentar ou se o gás tá acabando mais rápido?',
            adequada: true,
            pontos: 3,
            porque: 'Conecta o Scale Stop a um problema real do cliente (aquecedor a gás) com implicação concreta.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Aquecedor a gás precisa do Scale Stop pra não dar problema. É R$8.990, e fechando junto a instalação sai bonificada.',
            adequada: false,
            pontos: 1,
            porque: 'Vai direto pro preço sem criar percepção de necessidade.',
            risco: 'Cliente não vê valor e recusa.',
            melhora: 'Explique o problema (calcário na serpentina) e a consequência antes de falar preço.'
          },
          {
            texto: 'Ah, por nada específico. Só curiosidade!',
            adequada: false,
            pontos: 0,
            porque: 'Desperdiça a abertura que criou – fica sem sentido ter perguntado.',
            risco: 'Momento de upsell perdido.',
            melhora: 'Conecte a resposta ao problema de calcário no aquecedor e conduza para o Scale Stop.'
          }
        ]
      },
      {
        fala: 'Agora que você falou, o gás tá acabando mais rápido sim. E troco o chuveiro toda hora. Quanto custa esse Scale Stop?',
        opcoes: [
          {
            texto: 'O Scale Stop custa R$8.990 – o preço do produto é o mesmo, separado ou junto. A vantagem de fechar agora é logística: nossa equipe faz uma visita só e instala os dois equipamentos juntos, e por isso consigo bonificar a instalação do Scale Stop (R$ 590) no fechamento. Protege o aquecedor, os chuveiros e a máquina de lavar de uma vez. Quer incluir no pedido?',
            adequada: true,
            pontos: 3,
            porque: 'Preço do produto intacto + vantagem logística real (uma visita só) + instalação do segundo equipamento bonificada como moeda de fechamento + pergunta de fechamento.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'R$8.990. Mas vale cada centavo pelo que vai economizar em manutenção.',
            adequada: false,
            pontos: 1,
            porque: 'Deu o preço seco, sem mostrar a vantagem logística de fechar junto.',
            risco: 'Cliente acha caro e recusa.',
            melhora: 'Mantenha o preço do produto e destaque a vantagem de fechar junto: uma visita só e a instalação do Scale Stop bonificada no fechamento.'
          },
          {
            texto: 'Vou te mandar uma proposta separada do Scale Stop por email, tá? Daí você analisa com calma.',
            adequada: false,
            pontos: 0,
            porque: 'O momento é AGORA – mandar proposta "pra analisar" é perder o momento de compra.',
            risco: 'Cliente "esfria", proposta fica no email e nunca é respondida.',
            melhora: 'Feche na mesma ligação aproveitando o momento de decisão.'
          }
        ]
      }
    ]
  },

  /* =========================================================
     12. Lead Inbound (Net) de Facebook Ads – primeira ligação
     ========================================================= */
  {
    id: 12,
    titulo: 'Lead Inbound (Net) de Facebook Ads — Primeira Ligação',
    obrigatorio: true,
    contexto:
      '<p>Lead <strong>inbound (Net, na taxonomia de Receita Previsível)</strong> captado por <strong>Facebook Ads</strong> – ' +
      'preencheu formulário pedindo informações. ' +
      'Primeira ligação. O lead pode nem lembrar que preencheu. ' +
      'Objetivo: <em>qualificar e agendar diagnóstico</em>.</p>',
    passos: [
      {
        fala: '(Você liga. O lead atende.) Alô?',
        opcoes: [
          {
            texto: 'Oi Maria, tudo bem? Aqui é o Carlos da Tudo de Filtro. Você preencheu um formulário no Facebook sobre tratamento de água – lembra? Queria entender rapidinho o que motivou o seu interesse. Pode falar agora?',
            adequada: true,
            pontos: 3,
            porque: 'Identificação + contexto (formulário do Facebook) + pedido de permissão + pergunta aberta.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Oi, aqui é da Tudo de Filtro! Temos uma promoção imperdível de filtros essa semana…',
            adequada: false,
            pontos: 0,
            porque: 'Abordagem de telemarketing – sem personalização, sem contexto, direto na oferta.',
            risco: 'Lead desliga nos primeiros 10 segundos.',
            melhora: 'Use o nome do lead, cite o formulário como contexto e peça permissão antes de qualquer oferta.'
          },
          {
            texto: 'Oi Maria! Vi que você tem interesse em filtros. Posso te mandar nosso catálogo por WhatsApp?',
            adequada: false,
            pontos: 1,
            porque: 'Usa o nome, mas pula a qualificação e oferece catálogo genérico.',
            risco: 'Catálogo sem contexto é ignorado. Não qualificou a necessidade.',
            melhora: 'Antes de enviar material, descubra o que motivou o interesse.'
          }
        ]
      },
      {
        fala: 'Ah sim, lembro! Preenchi porque a água aqui tem gosto estranho. Mas não sei direito o que vocês fazem.',
        opcoes: [
          {
            texto: 'Que bom que lembra! A gente é especialista em tratamento de água pra residências. Me conta: esse gosto estranho é constante ou aparece mais em algum horário? E a água vem da rua ou de poço?',
            adequada: true,
            pontos: 3,
            porque: 'Explica o que faz de forma simples e já inicia qualificação com perguntas de Situação.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Somos a maior empresa de filtros do Brasil! Trabalhamos com Filtro de Entrada, Iron Free e Scale Stop. Posso explicar cada um?',
            adequada: false,
            pontos: 0,
            porque: 'Discurso institucional + lista de produtos que o lead não conhece – sobrecarrega.',
            risco: 'Lead se perde nos nomes dos produtos e desliga.',
            melhora: 'Foque na dor do cliente (gosto estranho) e faça perguntas de qualificação.'
          },
          {
            texto: 'Gosto estranho pode ser cloro, ferro ou outros contaminantes. Qual é a cor da água?',
            adequada: false,
            pontos: 1,
            porque: 'Pergunta técnica boa, mas sem antes explicar quem é a empresa e o que faz.',
            risco: 'Lead não sabe com quem está falando e desconfia.',
            melhora: 'Explique brevemente o que a empresa faz, depois entre nas perguntas de qualificação.'
          }
        ]
      },
      {
        fala: 'É constante, e é da rua. Sabesp. Moro em apartamento. Tem solução pra apartamento?',
        opcoes: [
          {
            texto: 'Tem sim! Para apartamento, o Filtro de Entrada compacto se instala no cavalete, antes da água entrar no apartamento. Filtra 100% da água que você usa – banho, cozinha, tudo. O investimento começa em R$3.490, mais a instalação profissional (R$ 590). O ideal seria eu te explicar com mais detalhes e entender melhor o seu caso. Consigo te atender por vídeo amanhã às 10h ou às 15h – qual fica melhor?',
            adequada: true,
            pontos: 3,
            porque: 'Responde a dúvida (tem pra apto), dá faixa de preço, e propõe próximo passo concreto com 2 opções de horário.',
            risco: '',
            melhora: ''
          },
          {
            texto: 'Tem! Vou te mandar um PDF com todas as opções pra apartamento. Me passa seu email?',
            adequada: false,
            pontos: 1,
            porque: 'PDF genérico não substitui atendimento consultivo – lead inbound recém-captado precisa de conversa.',
            risco: 'PDF não é lido, lead esfria.',
            melhora: 'Proponha uma call/vídeo de 15 min para explicar e dimensionar.'
          },
          {
            texto: 'Pra apartamento, o ideal é o Filtro de Entrada. Quer que eu passe o preço?',
            adequada: false,
            pontos: 1,
            porque: 'Vai direto ao preço sem qualificação completa (qual andar, ponto de instalação, vazão).',
            risco: 'Preço sem contexto pode assustar. Sem qualificação, dimensionamento pode estar errado.',
            melhora: 'Dê uma faixa de preço e proponha uma call detalhada para dimensionar corretamente.'
          }
        ]
      }
    ]
  }
];

module.exports = { ROLEPLAYS };
