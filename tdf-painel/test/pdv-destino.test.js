// Destino da venda de balcão: instalar, enviar ou levar na hora — pedido do
// dono (31/ago/2026): "tem que ter o tipo de venda se tem que instalar ou
// somente enviar".
//
// O que estes testes protegem:
//   1. NÃO-REGRESSÃO: venda sem destino escolhido continua funcionando, como
//      retirada — o caso comum do balcão. Nenhuma venda pode ser barrada por
//      um campo que não existia ontem.
//   2. Instalar exige a observação; enviar exige a transportadora. As duas
//      recusas são do SERVIDOR — a tela é conveniência e se contorna.
//   3. 🚨 O CAMINHO DE SUCESSO: quem preenche direito PASSA. Uma trava que
//      barra todo mundo passa no teste de bloqueio e para o time inteiro.
//   4. O valor gravado é o RÓTULO ('Instalação'/'Envio'), nunca o actual_value
//      mentiroso do picklist ('Não'/'Sim').
const { test } = require('node:test');
const assert = require('node:assert');

const { resolveDestino, parseFrete } = require('../lib/bi-pdv');

// ── 1. NÃO-REGRESSÃO ────────────────────────────────────────────────────────
test('sem destino no payload, a venda passa como retirada', () => {
  const r = resolveDestino({});
  assert.strictEqual(r.erro, null);
  assert.strictEqual(r.destino, 'retirada');
  assert.strictEqual(r.tipoVenda, 'Retirada na Loja');
});

test('destino desconhecido nunca barra a venda — cai em retirada', () => {
  for (const v of ['banana', '', null, undefined, 42]) {
    const r = resolveDestino({ destino: v });
    assert.strictEqual(r.erro, null, `destino ${JSON.stringify(v)} barrou a venda`);
    assert.strictEqual(r.tipoVenda, 'Retirada na Loja');
  }
});

// ── 2. As duas recusas ──────────────────────────────────────────────────────
test('instalação sem observação é recusada no servidor', () => {
  for (const obs of [undefined, '', '   ']) {
    const r = resolveDestino({ destino: 'instalacao', obsInstalacao: obs });
    assert.match(r.erro || '', /observação/i);
  }
});

test('envio sem transportadora é recusado no servidor', () => {
  for (const t of [undefined, '', '  ']) {
    const r = resolveDestino({ destino: 'envio', transportadora: t });
    assert.match(r.erro || '', /transportadora/i);
  }
});

// ── 3. O CAMINHO DE SUCESSO (o teste que importa) ──────────────────────────
test('instalação COM observação passa', () => {
  const r = resolveDestino({ destino: 'instalacao', obsInstalacao: 'poço, precisa de eletricista' });
  assert.strictEqual(r.erro, null);
  assert.strictEqual(r.tipoVenda, 'Instalação');
});

test('envio COM transportadora passa', () => {
  const r = resolveDestino({ destino: 'envio', transportadora: 'Jamef' });
  assert.strictEqual(r.erro, null);
  assert.strictEqual(r.tipoVenda, 'Envio');
});

test('envio não exige frete — transportadora basta', () => {
  const r = resolveDestino({ destino: 'envio', transportadora: 'Braspress', valorFrete: '' });
  assert.strictEqual(r.erro, null);
});

// ── 4. O rótulo, nunca o actual_value mentiroso ────────────────────────────
test('grava o RÓTULO do picklist, nunca Sim/Não', () => {
  assert.strictEqual(resolveDestino({ destino: 'envio', transportadora: 'x' }).tipoVenda, 'Envio');
  assert.strictEqual(resolveDestino({ destino: 'instalacao', obsInstalacao: 'x' }).tipoVenda, 'Instalação');
  for (const d of ['instalacao', 'envio', 'retirada']) {
    const t = resolveDestino({ destino: d, obsInstalacao: 'x', transportadora: 'x' }).tipoVenda;
    assert.ok(!['Sim', 'Não'].includes(t), `gravaria ${t}, que o filtro do CRM não acha`);
  }
});

// ── 5. Frete: o balcão digita de tudo ───────────────────────────────────────
test('frete aceita os formatos que o operador digita', () => {
  assert.strictEqual(parseFrete('3.500,00'), 3500);
  assert.strictEqual(parseFrete('120,50'), 120.5);
  assert.strictEqual(parseFrete('R$ 89,90'), 89.9);
  assert.strictEqual(parseFrete('250'), 250);
  assert.strictEqual(parseFrete(180), 180);
});

test('frete vazio ou zerado vira null — não grava 0 mentindo pra quem lê o card', () => {
  for (const v of ['', null, undefined, '0', '0,00', 'abc', -5]) {
    assert.strictEqual(parseFrete(v), null, `parseFrete(${JSON.stringify(v)}) deveria ser null`);
  }
});

// ── 6. Produto entregue ─────────────────────────────────────────────────────
// Pedido do dono (31/ago): "as vezes o cliente vai na loja e leva o produto,
// tem que colocar produto entregue sim ou nao".
//
// Medido em 31/08: das 50 vendas "Retirada na Loja", 44 não viraram registro
// em módulo nenhum — a venda de retirada some da operação. É esse campo que
// faz ela parar de sumir.
const { marcaEntrega } = require('../lib/bi-pdv');

test('retirada nasce ENTREGUE, com a data de hoje', () => {
  assert.deepStrictEqual(marcaEntrega('retirada', '2026-08-31'),
    { Produto_Entregue: true, Data_da_Entrega: '2026-08-31' });
});

test('instalação e envio nascem NÃO entregue — o produto ainda vai sair', () => {
  for (const d of ['instalacao', 'envio']) {
    const r = marcaEntrega(d, '2026-08-31');
    assert.strictEqual(r.Produto_Entregue, false, `${d} não deveria nascer entregue`);
    assert.ok(!('Data_da_Entrega' in r), `${d} não pode carimbar data de entrega`);
  }
});

test('destino desconhecido nunca marca entregue por engano', () => {
  for (const d of [undefined, null, '', 'banana']) {
    assert.strictEqual(marcaEntrega(d, '2026-08-31').Produto_Entregue, false);
  }
});

// ── 7. Produto sem código continua VISÍVEL na busca ─────────────────────────
// Relato do dono (31/ago): "quando procuro o produto nao ta achando no pdv".
// A busca achava — o PDV é que recusava no clique, e a tela dizia "nenhum
// produto com esse nome". Medido 31/08: 192 dos 1.063 produtos ativos (18%)
// estão sem código; "scale" acha 15 e 12 são recusados, "bebedouro" acha 26 e
// 16 são recusados. O flag `vendavel` deixa a tela mostrar o produto riscado
// em vez de mentir que não existe.
const { marcaVendavel } = require('../lib/bi-pdv');

test('produto com código é vendável; sem código, não', () => {
  assert.strictEqual(marcaVendavel({ Product_Code: 'PRD00001' }).vendavel, true);
  for (const c of [undefined, null, '', '   ']) {
    assert.strictEqual(marcaVendavel({ Product_Code: c }).vendavel, false,
      `código ${JSON.stringify(c)} não deveria ser vendável`);
  }
});

test('o produto nunca some da lista — só perde o direito de ser clicado', () => {
  const r = marcaVendavel({ id: '1', Product_Name: 'BEBEDOURO 100 L', Product_Code: '' });
  assert.strictEqual(r.nome, 'BEBEDOURO 100 L');
  assert.strictEqual(r.vendavel, false);
});

// ── 8. Funil da venda de balcão ─────────────────────────────────────────────
// Pedido do dono (01/set): "quando sobe a venda do edson no pdv tem que subir
// pro funil base". Antes disso a venda nascia com Pipeline VAZIO — 5 das 6
// vendas de balcão sem funil nenhum, então a loja sumia do relatório.
//
// 🚨 Este teste existe pra travar o NOME. O funil tem erro de digitação no CRM
// ("Fúnil", com acento no U) e o picklist declara actual='Pipeline Teste 2
// (Bebedouro)'. Medido 01/09: o filtro só aceita o RÓTULO —
// (Pipeline:equals:Pipeline Teste 2 (Bebedouro)) devolve INVALID_QUERY.
// Quem "corrigir" a digitação ou trocar pelo actual_value faz a venda sumir do
// funil em silêncio: o Zoho aceita a escrita e não reclama.
const { PIPELINE_BALCAO } = require('../lib/bi-pdv');

test('o funil do balcão é exatamente "Fúnil Base" — com o typo do CRM', () => {
  assert.strictEqual(PIPELINE_BALCAO, 'Fúnil Base');
});

test('não pode virar o actual_value nem a grafia "correta"', () => {
  assert.notStrictEqual(PIPELINE_BALCAO, 'Funil Base');
  assert.notStrictEqual(PIPELINE_BALCAO, 'Pipeline Teste 2 (Bebedouro)');
  assert.ok(PIPELINE_BALCAO.includes('ú'), 'perdeu o acento do "Fúnil" que o CRM usa');
});

// ── 9. Endereço no Negócio e no Orçamento ───────────────────────────────────
// Relato do dono (01/set): "quando foi criado o orcamento veio sem informacao
// nenhuma... tudo do endereco esta vazio".
//
// A causa: o PDV mandava o endereço pro Contato e pro Omie, mas o Negócio
// recebia SÓ a cidade e o Orçamento não recebia nada. O Zoho só herda endereço
// do contato quando o orçamento é criado pela TELA — por API ele grava
// exatamente o que recebe.
const { montaEnderecoDeal, montaEnderecoQuote, numeroInteiro,
        linhaComplementoDeal } = require('../lib/bi-pdv');

test('endereço completo chega ao Negócio, não só a cidade', () => {
  const r = montaEnderecoDeal({
    endereco: 'Alameda Mario de Andrade', numero: '84', bairro: 'Reserva do Paratehy',
    cidade: 'São José dos Campos', uf: 'sp', cep: '12244552',
  });
  assert.strictEqual(r.Endere_o, 'Alameda Mario de Andrade');
  assert.strictEqual(r.Bairro, 'Reserva do Paratehy');
  assert.strictEqual(r.CEP, '12244552');
  assert.strictEqual(r.Estado, 'SP', 'UF tem que subir em maiúscula');
  assert.strictEqual(r.N_mero, 84);
});

// 🚨 `N_mero` é INTEGER nos dois módulos. Mandar "84A" faz o Zoho recusar o
// registro INTEIRO — a venda sumiria do CRM, mesma armadilha do campo `CPF`.
test('número não-numérico nunca vai pro campo integer', () => {
  for (const n of ['84A', 's/n', 'S/N', 'casa 2', '']) {
    assert.strictEqual(numeroInteiro(n), null, `numeroInteiro(${JSON.stringify(n)})`);
    assert.ok(!('N_mero' in montaEnderecoDeal({ numero: n })), `${n} vazou pro N_mero`);
  }
  assert.strictEqual(numeroInteiro('84'), 84);
});

// 🚨 Negócios NÃO TEM campo `Complemento` (conferido nos metadados 02/09) e o
// Zoho aceita escrita em campo inexistente devolvendo SUCCESS — o dado some.
// Por isso complemento e número não-numérico viram linha no Description.
test('Negócios não recebe campo Complemento — ele não existe lá', () => {
  const r = montaEnderecoDeal({ endereco: 'Rua A', numero: 's/n', complemento: 'fundos' });
  assert.ok(!('Complemento' in r), 'gravaria num campo que não existe e sumiria');
});

test('número não-numérico e complemento não se perdem — viram linha no Description', () => {
  const l = linhaComplementoDeal({ numero: 's/n', complemento: 'fundos' });
  assert.match(l, /s\/n/);
  assert.match(l, /fundos/);
  assert.strictEqual(linhaComplementoDeal({ numero: '84' }), '',
    'número normal já foi pro campo N_mero — não repete no Description');
  assert.strictEqual(linhaComplementoDeal({}), '');
});

test('campo vazio não entra — não pode apagar o que já está no card', () => {
  assert.deepStrictEqual(montaEnderecoDeal({}), {});
  assert.deepStrictEqual(montaEnderecoQuote({}), {});
  const r = montaEnderecoDeal({ cidade: 'Jacareí' });
  assert.deepStrictEqual(Object.keys(r), ['Cidade']);
});

test('orçamento recebe os campos da TELA e os Billing/Shipping da impressão', () => {
  const r = montaEnderecoQuote({
    endereco: 'Rua A', numero: '10', bairro: 'Centro',
    cidade: 'Jacareí', uf: 'SP', cep: '12300000',
  });
  // os que aparecem no layout Standard de Orçamentos
  for (const c of ['Rua', 'N_mero', 'Bairro', 'Cidade', 'Estado', 'CEP']) {
    assert.ok(c in r, `faltou ${c} — é o que a tela mostra`);
  }
  // 🚨 E SÓ esses. Campo fora do layout o Zoho aceita, responde SUCCESS e NÃO
  // GRAVA. Medido 02/09: dos 8 Billing_*/Shipping_* enviados, só Shipping_Code
  // gravou — o único que está no layout Standard de Orçamentos.
  for (const c of ['Billing_Street', 'Billing_City', 'Billing_State', 'Billing_Code',
                   'Shipping_Street', 'Shipping_City', 'Shipping_State']) {
    assert.ok(!(c in r), `${c} está fora do layout — mandar é ilusão de que salvou`);
  }
  assert.strictEqual(r.Shipping_Code, '12300000', 'este está no layout e grava');
});

// ── 10. Contato genérico ganha nome ────────────────────────────────────────
// Caso real 31/08: a venda das 14:21 saiu sem nome e criou o contato
// "Consumidor Final". A das 14:28, já com "Celso Luis Vitor", achou esse
// contato pelo telefone e reaproveitou — mantendo o rótulo genérico. O cliente
// entrou na base sem nome: some da busca por nome e nunca entra na régua de
// troca de refil como pessoa.
const { ehNomeGenerico, nomeParaContato } = require('../lib/bi-pdv');

test('reconhece os rótulos genéricos do balcão', () => {
  assert.strictEqual(ehNomeGenerico({ Last_Name: 'Consumidor Final' }), true);
  assert.strictEqual(ehNomeGenerico({ First_Name: 'Consumidor', Last_Name: 'Final' }), true,
    'o CRM quebrou o nome em dois — continua sendo genérico');
  assert.strictEqual(ehNomeGenerico({ Last_Name: 'BALCÃO' }), true);
});

// 🚨 O teste que importa: nome de gente NUNCA pode ser tratado como genérico,
// senão a próxima venda renomeia o cliente errado.
test('nome de pessoa nunca é considerado genérico', () => {
  for (const c of [{ First_Name: 'Celso', Last_Name: 'Luis Vitor' },
                   { Last_Name: 'Silva' },
                   { First_Name: 'Maria', Last_Name: 'Final Souza' },
                   { Last_Name: 'Consumidor Final Ltda' }]) {
    assert.strictEqual(ehNomeGenerico(c), false, `${JSON.stringify(c)} virou genérico`);
  }
});

test('nome vira First/Last sem inventar sobrenome vazio', () => {
  assert.deepStrictEqual(nomeParaContato('Celso Luis Vitor'),
    { First_Name: 'Celso', Last_Name: 'Luis Vitor' });
  // Uma palavra vai INTEIRA pro Last_Name — sobrenome vazio gera o Last_Name="."
  // que suja a base importada.
  assert.deepStrictEqual(nomeParaContato('Madonna'), { Last_Name: 'Madonna' });
  assert.deepStrictEqual(nomeParaContato('  '), { Last_Name: 'Consumidor Final' });
});

test('sem nome, "Consumidor Final" vai INTEIRO no sobrenome', () => {
  const r = nomeParaContato('');
  assert.strictEqual(r.Last_Name, 'Consumidor Final');
  assert.ok(!('First_Name' in r), 'não pode criar uma pessoa de sobrenome "Final"');
});

// ── 11. Produtos do Omie na busca do balcão ────────────────────────────────
// Relato do dono (02/set): "ele procurou e ai nao achou o produto" — e depois
// "quero que vc integre os produtos omie no pdv".
//
// A busca só olhava o Zoho Products. Medido 02/09: 74 produtos ATIVOS no Omie
// (refis, kits, bebedouros, peças) não existem no Zoho — o operador procurava
// e não achava, mesmo o produto existindo no ERP e podendo ser faturado.
//
// A busca ficou presa no Zoho por um motivo real: a linha do Orçamento precisa
// do `id` do produto no Zoho. O Omie precisa só do `codigo`. Agora o item do
// Omie entra sem id e ganha um produto no Zoho na hora da venda.
const { mesclaProdutos } = require('../lib/bi-pdv');
const opdv2 = require('../lib/omie-pdv');

test('produto do Omie que não está no Zoho entra na lista', () => {
  const r = mesclaProdutos(
    [{ codigo: 'PRD00001', nome: 'FILTRO FILTRALI V2', id: 'z1' }],
    [{ codigo: '000150', nome: 'REFIL CARBON BLOCK 20"', id: null, origem: 'omie' }],
  );
  assert.strictEqual(r.length, 2);
  assert.strictEqual(r[1].codigo, '000150');
});

// 🚨 Sem isto o operador veria o mesmo produto duas vezes e escolheria o
// errado — o do Omie não tem id, e a linha do orçamento nasceria vazia.
test('mesmo código nos dois catálogos não duplica — o Zoho ganha, é quem tem id', () => {
  const r = mesclaProdutos(
    [{ codigo: 'PRD00001', nome: 'FILTRO FILTRALI V2', id: 'z1' }],
    [{ codigo: 'prd00001', nome: 'FILTRO FILTRALI V2', id: null }],
  );
  assert.strictEqual(r.length, 1, 'duplicou — a comparação de código tem que ignorar caixa');
  assert.strictEqual(r[0].id, 'z1');
});

test('produto do Zoho sem código não some da lista', () => {
  const r = mesclaProdutos([{ codigo: '', nome: 'BEBEDOURO 100 L', id: 'z9', vendavel: false }], []);
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].vendavel, false);
});

test('busca no catálogo exige TODAS as palavras', () => {
  const cat = [
    { codigo: '000150', nome: 'REFIL CARBON BLOCK 20" 5 MICRAS - SLIM', preco: 290 },
    { codigo: '003', nome: 'KIT REFIL COM 2 UNIDADES', preco: 65 },
  ];
  assert.strictEqual(opdv2.filtraCatalogo(cat, 'refil 20').length, 1);
  assert.strictEqual(opdv2.filtraCatalogo(cat, 'refil').length, 2);
  assert.strictEqual(opdv2.filtraCatalogo(cat, 'r').length, 0, 'menos de 2 letras não busca');
  assert.strictEqual(opdv2.filtraCatalogo(cat, '000150')[0].codigo, '000150', 'acha por código');
});

// ── 12. Nome do cliente: "Consumidor Final" não entra sozinho ───────────────
// Relato do dono (17/set): "quando sobe a venda no pdv ele sobe na omie como
// consumidor final ao inves do nome do cliente".
//
// Medido 17/09 no Omie: das 6 fichas criadas pelo PDV, as 2 SEM CPF estão como
// "Consumidor Final" — e A NOTA FISCAL SAI NESSE NOME. Pior: a busca por
// telefone reusa a ficha, então o cliente fica genérico pra sempre.
//
// Duas pontas: a tela parava de preencher o rótulo sozinha, e a ficha do Omie
// que já nasceu genérica é renomeada quando uma venda futura traz nome.
const opdv3 = require('../lib/omie-pdv');

test('razão social genérica é reconhecida, em qualquer caixa', () => {
  for (const r of ['Consumidor Final', 'CONSUMIDOR FINAL', 'consumidor final', ' Balcão ']) {
    assert.strictEqual(opdv3.ehRazaoGenerica(r), true, `${r} deveria ser genérica`);
  }
});

// 🚨 O teste que importa: renomear a ficha de um cliente REAL seria pior que o
// problema original — trocaria o nome na nota fiscal de quem já está certo.
test('nome de gente ou empresa nunca é tratado como genérico', () => {
  for (const r of ['Celso Luis Vitor', 'Consumidor Final Ltda', 'Balcão do Zé',
                   'FRANCISCO BOSCO DE SOUZA', '', null, undefined]) {
    assert.strictEqual(opdv3.ehRazaoGenerica(r), false, `${r} virou genérica`);
  }
});
