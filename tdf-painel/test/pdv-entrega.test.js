// Entrega em outro endereço no PDV de balcão — pedido do dono (24/ago/2026).
//
// O que estes testes protegem:
//   1. NÃO-REGRESSÃO: venda sem entrega alternativa monta o pedido do Omie
//      exatamente como antes (a chave `outros_detalhes` nem aparece).
//   2. O endereço de entrega vai pro bloco "Outro Destinatário" do Omie
//      (campos sufixados `Od`) e NUNCA altera o cadastro do cliente.
//   3. Marcar "entregar em outro endereço" e deixar incompleto é recusado
//      no SERVIDOR — a tela é só conveniência e se contorna.
const { test } = require('node:test');
const assert = require('node:assert');

const opdv = require('../lib/omie-pdv');

// ── 1. NÃO-REGRESSÃO ────────────────────────────────────────────────────────
test('sem entrega alternativa, montaOutrosDetalhes devolve null (payload igual ao de antes)', () => {
  assert.strictEqual(opdv.montaOutrosDetalhes(undefined), null);
  assert.strictEqual(opdv.montaOutrosDetalhes(null), null);
});

test('entrega marcada mas sem logradouro não vira bloco vazio no pedido', () => {
  assert.strictEqual(opdv.montaOutrosDetalhes({ usar: true, cidade: 'Jacareí' }), null);
});

// ── 2. O bloco do Omie ──────────────────────────────────────────────────────
test('endereço de entrega vira os campos Od do Omie, com os nomes exatos', () => {
  const od = opdv.montaOutrosDetalhes({
    endereco: 'Rua das Palmeiras', numero: '450', complemento: 'Bloco B apto 32',
    bairro: 'Jardim Paraíso', cidade: 'São José dos Campos', uf: 'SP', cep: '12240100',
  });
  assert.deepStrictEqual(od, {
    cEnderecoOd: 'Rua das Palmeiras',
    cNumeroOd: '450',
    cComplementoOd: 'Bloco B apto 32',
    cBairroOd: 'Jardim Paraíso',
    cCidadeOd: 'São José dos Campos',
    cEstadoOd: 'SP',
    cCEPOd: '12240100',
  });
});

test('cidade da entrega perde o sufixo "(UF)" que o Omie devolve', () => {
  const od = opdv.montaOutrosDetalhes({
    endereco: 'Av. Brasil', numero: '10', cidade: 'SAO JOSE DOS CAMPOS (SP)', uf: 'SP',
  });
  assert.ok(!od.cCidadeOd.includes('('), `cidade veio suja: ${od.cCidadeOd}`);
});

test('nome e documento de quem recebe só entram quando digitados', () => {
  const sem = opdv.montaOutrosDetalhes({ endereco: 'Rua A', numero: '1' });
  assert.ok(!('cNomeOd' in sem), 'cNomeOd não deveria existir sem nome');
  assert.ok(!('cCnpjCpfOd' in sem), 'cCnpjCpfOd não deveria existir sem documento');

  const com = opdv.montaOutrosDetalhes({
    endereco: 'Rua A', numero: '1', nome: 'Portaria — Sr. Jonas', documento: '123.456.789-00',
  });
  assert.strictEqual(com.cNomeOd, 'Portaria — Sr. Jonas');
  assert.strictEqual(com.cCnpjCpfOd, '12345678900', 'documento vai só com dígitos');
});

test('campo longo é truncado no limite do Omie (pedido inteiro seria recusado)', () => {
  const od = opdv.montaOutrosDetalhes({
    endereco: 'R'.repeat(200), numero: '1', bairro: 'B'.repeat(200),
    cidade: 'C'.repeat(200), uf: 'SPX', cep: '1'.repeat(40),
  });
  assert.ok(od.cEnderecoOd.length <= 60, `endereço ${od.cEnderecoOd.length}`);
  assert.ok(od.cBairroOd.length <= 60, `bairro ${od.cBairroOd.length}`);
  assert.ok(od.cCidadeOd.length <= 60, `cidade ${od.cCidadeOd.length}`);
  assert.ok(od.cEstadoOd.length <= 2, `UF ${od.cEstadoOd.length}`);
  assert.ok(od.cCEPOd.length <= 15, `CEP ${od.cCEPOd.length}`);
});

// ── 3. A recusa mora no servidor ────────────────────────────────────────────
// finalizarVenda faz I/O (Postgres, Omie, Zoho), mas a validação de entrega
// roda ANTES de qualquer chamada externa — é o caminho que estes testes
// exercitam. Se algum dia ela for movida pra depois do I/O, estes testes
// quebram, que é exatamente o aviso desejado.
const bi = require('../lib/bi-pdv');

const VENDA_BASE = {
  idem: 'teste-entrega',
  empresa: 'tdf',
  telefone: '12988480749',
  clienteZohoId: 'ID_EXISTENTE',   // evita a exigência de endereço do cliente novo
  clienteNome: 'Cliente Teste',
  itens: [{ codigo: 'ABC123', nome: 'Refil', qtd: 1, valor: 100, ncm: '84212100' }],
};

test('entrega marcada e incompleta é RECUSADA no servidor, dizendo o que falta', async () => {
  const r = await bi.finalizarVenda(
    { ...VENDA_BASE, entrega: { usar: true, endereco: 'Rua das Flores' } },
    { username: 'edson' }, null);
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.etapa, 'validacao-entrega');
  for (const campo of ['número', 'bairro', 'cidade', 'UF']) {
    assert.ok(r.erro.includes(campo), `erro deveria citar "${campo}": ${r.erro}`);
  }
  assert.ok(!r.erro.includes('endereço obrigatório'),
    'não deve reclamar do logradouro, que foi preenchido');
});

test('entrega marcada exige o endereço inteiro, mas NUNCA o CEP', async () => {
  const r = await bi.finalizarVenda({
    ...VENDA_BASE,
    entrega: { usar: true, endereco: 'Rua das Flores', numero: '10',
               bairro: 'Centro', cidade: 'Jacareí', uf: 'SP' },   // sem CEP
  }, { username: 'edson' }, null);
  assert.notStrictEqual(r.etapa, 'validacao-entrega',
    'CEP não pode ser obrigatório na entrega — cliente pode não saber');
});

test('entrega DESMARCADA não exige nada, mesmo com os campos vazios', async () => {
  const r = await bi.finalizarVenda(
    { ...VENDA_BASE, entrega: { usar: false, endereco: '', numero: '' } },
    { username: 'edson' }, null);
  assert.notStrictEqual(r.etapa, 'validacao-entrega');
});

test('venda sem a chave `entrega` segue funcionando (payload antigo)', async () => {
  const r = await bi.finalizarVenda({ ...VENDA_BASE }, { username: 'edson' }, null);
  assert.notStrictEqual(r.etapa, 'validacao-entrega');
});
