// Nomes dos campos que vão pro cadastro de cliente do Omie (clientes_cadastro).
//
// Nasceu de um bug real de produção (26/08/2026): o balcão não conseguia
// cadastrar NENHUM cliente novo. O Omie recusava o pedido inteiro com
//
//   "Tag [ENDERECO_COMPLEMENTO] não faz parte da estrutura do tipo
//    complexo [clientes_cadastro]!"
//
// A causa era um nome de campo errado (`endereco_complemento` em vez de
// `complemento`) que ia no payload SEMPRE — `omie.truncar` devolve string
// vazia pra `undefined`, então a chave existia mesmo quando o operador não
// digitava complemento nenhum. Toda venda pra cliente novo morria aí.
//
// Estes testes travam os nomes contra a estrutura documentada do Omie. Nome
// de campo errado no Omie NÃO falha em silêncio: derruba a venda inteira com
// o cliente na frente do operador.
const { test } = require('node:test');
const assert = require('node:assert');

// Campos válidos de endereço em `clientes_cadastro` (documentação da API do
// Omie, geral/clientes/). Qualquer tag fora desta lista faz o Omie recusar.
const VALIDOS_CLIENTE = new Set([
  'codigo_cliente_integracao', 'codigo_cliente_omie', 'razao_social', 'nome_fantasia',
  'cnpj_cpf', 'email', 'contato',
  'endereco', 'endereco_numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep',
  'codigo_pais', 'cidade_ibge', 'separar_endereco', 'pesquisar_cep',
  'telefone1_ddd', 'telefone1_numero', 'telefone2_ddd', 'telefone2_numero',
  'inscricao_estadual', 'inscricao_municipal', 'observacao', 'tags',
]);

// O erro real que motivou o teste — nunca mais pode aparecer no payload.
const PROIBIDOS = ['endereco_complemento', 'ENDERECO_COMPLEMENTO', 'endereco_bairro', 'endereco_cidade'];

const fonte = require('fs').readFileSync(require.resolve('../lib/omie-pdv.js'), 'utf8');

test('nenhum nome de campo proibido sobrou no cadastro de cliente', () => {
  for (const proibido of PROIBIDOS) {
    assert.ok(!fonte.includes(`${proibido}:`),
      `"${proibido}" nao existe em clientes_cadastro e derruba IncluirCliente`);
    assert.ok(!fonte.includes(`write: '${proibido}'`),
      `"${proibido}" no mapa de gravacao derruba AlterarCliente`);
  }
});

test('o complemento usa o nome que o Omie aceita, na leitura E na gravacao', () => {
  assert.ok(/\bcomplemento:\s*omie\.truncar/.test(fonte),
    'o payload de IncluirCliente precisa mandar `complemento`');
  assert.ok(/read:\s*'complemento',\s*write:\s*'complemento'/.test(fonte),
    'no mapa de divergencia, leitura e gravacao do complemento sao o MESMO nome');
});

test('todo campo do payload de cliente existe em clientes_cadastro', () => {
  // Pega o bloco do `param` de IncluirCliente e confere chave por chave.
  const ini = fonte.indexOf('codigo_cliente_integracao: chaveIntegracao');
  assert.ok(ini > 0, 'nao achei o payload de IncluirCliente');
  const bloco = fonte.slice(ini, fonte.indexOf('IncluirCliente', ini));
  const chaves = [...bloco.matchAll(/^\s{4}([a-z_0-9]+):/gm)].map(m => m[1]);
  assert.ok(chaves.length >= 10, `esperava varios campos, achei ${chaves.length}`);
  for (const k of chaves) {
    assert.ok(VALIDOS_CLIENTE.has(k),
      `"${k}" nao consta em clientes_cadastro — o Omie recusa o cadastro inteiro`);
  }
});
