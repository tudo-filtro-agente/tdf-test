const test = require('node:test');
const assert = require('node:assert');

const omie = require('../lib/omie');
const opdv = require('../lib/omie-pdv');

function comMock(respostas, fn) {
  const real = omie.chamar;
  const chamadas = [];
  omie.chamar = async (empresa, endpoint, call, param) => {
    chamadas.push({ empresa, endpoint, call, param });
    const r = respostas[call];
    if (typeof r === 'function') return r(param);
    if (r instanceof Error) throw r;
    return r;
  };
  return Promise.resolve(fn(chamadas)).finally(() => { omie.chamar = real; });
}

// criaPedido() chama omie.contaCorrente(empresa), que estoura erro se a env var
// da conta corrente não estiver setada. Os testes de criaPedido precisam dela.
const CONTA_ENV = { 'Tudo de Filtro': 'OMIE_TDF_CONTA_CORRENTE', 'Mococa': 'OMIE_MOCOCA_CONTA_CORRENTE' };

function comContaCorrente(empresa, valor, fn) {
  const chave = CONTA_ENV[empresa];
  const real = process.env[chave];
  process.env[chave] = valor;
  return Promise.resolve(fn()).finally(() => {
    if (real === undefined) delete process.env[chave]; else process.env[chave] = real;
  });
}

// Dublê de ConsultarProduto: recebe um mapa { SKU: { codigo_produto, ncm } } e
// devolve a resposta medida contra a API real (codigo_produto_integracao
// SEMPRE vazio no cadastro real — reproduzido aqui de propósito).
function produtoStub(mapa) {
  return (param) => {
    const p = mapa[param.codigo];
    if (!p) {
      throw new Error('omie ConsultarProduto: ERROR: Produto não encontrado para o Código [' + param.codigo + ']');
    }
    return {
      codigo: param.codigo,
      codigo_produto: p.codigo_produto,
      codigo_produto_integracao: '',
      ncm: p.ncm,
    };
  };
}

test('garanteCliente reusa cliente existente sem criar', async () => {
  await comMock({
    ListarClientes: (param) => {
      assert.equal(param.pagina, 1);
      assert.equal(param.clientesFiltro.cnpj_cpf, '12345678909');
      return { clientes_cadastro: [{ codigo_cliente_omie: 777 }] };
    },
    // Full ficha lida DEPOIS do achado resumido — ListarClientes sozinho não
    // traz endereço/telefone (ficha resumida); ConsultarCliente(codigo_cliente_omie)
    // é quem traz a ficha completa. Celular já bate com o que veio no
    // payload (mesmo DDD/número) — nada divergente, nada vazio pra
    // preencher.
    ConsultarCliente: (param) => {
      assert.equal(param.codigo_cliente_omie, 777);
      return { codigo_cliente_omie: 777, telefone1_ddd: '12', telefone1_numero: '999998888' };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Fulano', cpf: '12345678909', telefone: '5512999998888' });
    assert.equal(r.codigo_cliente_omie, 777);
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
    assert.ok(!chamadas.some(c => c.call === 'AlterarCliente'), 'cadastro já bate com o que foi digitado — não há o que alterar');
  });
});

// Trava original: ConsultarCliente NÃO aceita cnpj_cpf — o Omie rejeita com
// "Tag [CNPJ_CPF] não faz parte da estrutura do tipo complexo". A busca por
// documento tem que continuar usando ListarClientes; ConsultarCliente só
// entra DEPOIS, com codigo_cliente_omie (pra trazer a ficha completa — ver
// endereço/telefone abaixo) — nunca com cnpj_cpf.
test('garanteCliente busca por ListarClientes; ConsultarCliente so entra depois, com codigo_cliente_omie (nunca cnpj_cpf)', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 42 }] },
    ConsultarCliente: (param) => {
      assert.equal('cnpj_cpf' in param, false, 'ConsultarCliente nunca pode receber cnpj_cpf — o Omie rejeita essa tag');
      assert.equal(param.codigo_cliente_omie, 42);
      return { codigo_cliente_omie: 42 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Fulano', cpf: '12345678909' });
    assert.equal(r.codigo_cliente_omie, 42);
    assert.ok(chamadas.some(c => c.call === 'ConsultarCliente'), 'busca a ficha completa do cliente achado por documento');
  });
});

test('garanteCliente cria quando nao existe e trunca todos os campos longos', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      // razao_social (60) e nome_fantasia (50) vêm do mesmo cliente.nome, com
      // limites diferentes — se os tamanhos forem trocados entre si, os dois
      // asserts abaixo não batem ao mesmo tempo.
      assert.equal(param.razao_social.length, 60);
      assert.equal(param.nome_fantasia.length, 50);
      assert.equal(param.email.length, 60);
      assert.equal(param.endereco.length, 60);
      assert.equal(param.endereco_numero.length, 20);
      assert.equal(param.bairro.length, 60);
      assert.equal(param.cidade.length, 60);
      assert.equal(param.estado.length, 2);
      assert.equal(param.cep.length, 15);
      return { codigo_cliente_omie: 999 };
    },
  }, async () => {
    const r = await opdv.garanteCliente('Mococa', {
      nome: 'B'.repeat(80),
      cpf: '12345678909',
      // Telefone continua um valor sem forma reconhecível (nem 10/11 nem
      // 12/13 dígitos com "55") — separarDdd() devolve null pra isso, então
      // não é este teste que cobre a separação de DDD/número (ver testes
      // dedicados de telefone1_ddd/telefone1_numero mais abaixo).
      telefone: '5'.repeat(30),
      email: 'e'.repeat(70) + '@x.com',
      endereco: 'End'.repeat(30),
      numero: '9'.repeat(30),
      bairro: 'Bai'.repeat(30),
      cidade: 'C'.repeat(80),
      uf: 'SPX',
      cep: '1'.repeat(20),
    });
    assert.equal(r.codigo_cliente_omie, 999);
  });
});

// === ENDEREÇO — "erro na UF do cadastro" (bug real reportado pelo dono numa
// venda de balcão) e a cidade com sufixo "(UF)" que o Omie devolve ===
test('garanteCliente manda estado/uf, endereco completo e complemento no cadastro novo', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      // Mutação-alvo: se `estado` for mandado vazio/undefined, esta é a linha
      // que reproduz o bug real — o Omie recusa a criação do cliente.
      assert.equal(param.estado, 'SP');
      assert.equal(param.cidade, 'Bebedouro');
      assert.equal(param.endereco, 'Rua das Flores');
      assert.equal(param.endereco_numero, '120');
      assert.equal(param.bairro, 'Centro');
      assert.equal(param.cep, '14700-000');
      // 26/08/2026: este assert dizia `endereco_complemento` e CRISTALIZOU um
      // bug de producao — o Omie recusa essa tag e derrubava TODA criacao de
      // cliente novo no balcao. Em `clientes_cadastro` o campo e `complemento`.
      assert.equal(param.complemento, 'Apto 4');
      assert.ok(!('endereco_complemento' in param),
        'endereco_complemento nao existe em clientes_cadastro — o Omie recusa o cadastro inteiro');
      return { codigo_cliente_omie: 5001 };
    },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Ana', telefone: '5512999998888',
      endereco: 'Rua das Flores', numero: '120', complemento: 'Apto 4',
      bairro: 'Centro', cidade: 'Bebedouro', uf: 'SP', cep: '14700-000',
    });
    assert.equal(r.codigo_cliente_omie, 5001);
  });
});

// O Omie devolve a cidade "SAO JOSE DOS CAMPOS (SP)" — nome com a UF colada.
// Mandar isso de volta pro Omie ao GRAVAR duplicaria o sufixo (ou pioraria);
// a cidade que sai daqui pro param tem que estar limpa.
test('garanteCliente limpa o sufixo "(UF)" da cidade antes de mandar pro Omie (gravar)', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      assert.equal(param.cidade, 'SAO JOSE DOS CAMPOS');
      return { codigo_cliente_omie: 5002 };
    },
  }, async () => {
    await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Bruno', telefone: '5512999997777',
      endereco: 'Rua X', numero: '1', bairro: 'Bairro X',
      cidade: 'SAO JOSE DOS CAMPOS (SP)', uf: 'SP', cep: '12200-000',
    });
  });
});

// Cliente EXISTENTE achado por documento (ListarClientes): a cidade que o
// Omie guarda pode vir com o sufixo "(UF)" — quem lê este retorno (hoje ou no
// futuro) tem que receber a cidade já limpa, nunca "(UF)" vazando pra tela.
test('garanteCliente limpa o sufixo "(UF)" da cidade de um cliente existente achado por documento (ler)', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 777 }] },
    // A ficha COMPLETA (com a cidade suja) vem de ConsultarCliente — não do
    // resumo de ListarClientes.
    ConsultarCliente: { codigo_cliente_omie: 777, cidade: 'SAO JOSE DOS CAMPOS (SP)' },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', { nome: 'Fulano', cpf: '12345678909' });
    assert.equal(r.cidade, 'SAO JOSE DOS CAMPOS');
  });
});

// Mesma limpeza no caminho SEM documento (ConsultarCliente por telefone).
test('garanteCliente limpa o sufixo "(UF)" da cidade de um cliente existente achado por telefone (ler)', async () => {
  await comMock({
    ConsultarCliente: { codigo_cliente_omie: 8842, cidade: 'Bebedouro (SP)' },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', { nome: 'Sem Documento', telefone: '5512999997777' });
    assert.equal(r.cidade, 'Bebedouro');
  });
});

test('garanteCliente nao mexe na cidade de cliente existente quando ela nao vem no retorno', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 321 }] },
    ConsultarCliente: { codigo_cliente_omie: 321 },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', { nome: 'Fulano', cpf: '98765432100' });
    assert.equal(r.codigo_cliente_omie, 321);
    assert.equal('cidade' in r, false);
  });
});

test('garanteCliente propaga erro que nao e "nao existem registros" sem criar cliente', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: Timeout na API'),
  }, async (chamadas) => {
    await assert.rejects(
      () => opdv.garanteCliente('Tudo de Filtro', { nome: 'Fulano', cpf: '12345678909' }),
      /Timeout na API/
    );
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
  });
});

test('garanteCliente NAO cria cliente novo quando ListarClientes ja encontrou um', async () => {
  // Se o código ignorar o resultado de ListarClientes e criar mesmo assim,
  // este teste falha ao ver IncluirCliente sendo chamado.
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 321 }] },
    ConsultarCliente: { codigo_cliente_omie: 321 },
    IncluirCliente: () => { throw new Error('nao deveria criar — cliente ja existe'); },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Fulano', cpf: '98765432100' });
    assert.equal(r.codigo_cliente_omie, 321);
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
  });
});

// === Cliente sem CPF/CNPJ — o caso mais comum do balcão ===
// Antes do conserto, este caminho pulava QUALQUER busca e ia direto criar.
// Na 1a compra funciona; na 2a, com o mesmo telefone, o Omie recusa:
// "ERROR: Cliente já cadastrado para o Código de Integração [pdv-<telefone>]"
// porque codigo_cliente_integracao colide. A busca agora é por
// ConsultarCliente com codigo_cliente_integracao (medido contra a API real —
// ConsultarCliente aceita esse campo, ao contrário de cnpj_cpf).

test('garanteCliente sem documento busca por codigo_cliente_integracao e reusa se achar (2a compra do mesmo telefone)', async () => {
  await comMock({
    ConsultarCliente: (param) => {
      assert.equal(param.codigo_cliente_integracao, 'pdv-5512999997777');
      return { codigo_cliente_omie: 8842 };
    },
    IncluirCliente: () => { throw new Error('nao deveria criar — cliente ja existe pela chave de integracao'); },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Sem Documento', telefone: '5512999997777' });
    assert.equal(r.codigo_cliente_omie, 8842);
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
    assert.ok(!chamadas.some(c => c.call === 'ListarClientes'));
  });
});

test('garanteCliente sem documento cria quando ConsultarCliente diz "nao cadastrado" (cliente novo)', async () => {
  await comMock({
    ConsultarCliente: new Error('omie ConsultarCliente: ERROR: Cliente não cadastrado para o Código [0] !'),
    IncluirCliente: (param) => {
      assert.equal(param.codigo_cliente_integracao, 'pdv-5512988887777');
      assert.equal(param.cnpj_cpf, '');
      return { codigo_cliente_omie: 4321 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Sem Documento Novo', telefone: '5512988887777' });
    assert.equal(r.codigo_cliente_omie, 4321);
    assert.ok(chamadas.some(c => c.call === 'ConsultarCliente'));
    assert.ok(chamadas.some(c => c.call === 'IncluirCliente'));
  });
});

test('garanteCliente sem documento propaga erro do ConsultarCliente que nao seja "nao cadastrado" sem criar', async () => {
  await comMock({
    ConsultarCliente: new Error('omie ConsultarCliente: Timeout na API'),
  }, async (chamadas) => {
    await assert.rejects(
      () => opdv.garanteCliente('Tudo de Filtro', { nome: 'Sem Documento', telefone: '5512999996666' }),
      /Timeout na API/
    );
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
  });
});

test('garanteCliente com documento E telefone continua sem cair no caminho de ConsultarCliente por codigo_cliente_integracao (documento manda)', async () => {
  // Trava contra regressão cruzada: com documento presente, a busca tem que
  // ser SEMPRE ListarClientes(doc) -> ConsultarCliente(codigo_cliente_omie) —
  // nunca ConsultarCliente(codigo_cliente_integracao), que é o caminho
  // exclusivo de quem NÃO tem documento. Se o código regredir e passar a
  // ignorar o documento (indo direto pro caminho de telefone), este dublê de
  // ConsultarCliente lança ao ver codigo_cliente_integracao.
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 55 }] },
    ConsultarCliente: (param) => {
      if ('codigo_cliente_integracao' in param) throw new Error('nao deveria buscar por telefone quando ha documento');
      assert.equal(param.codigo_cliente_omie, 55);
      return { codigo_cliente_omie: 55 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro',
      { nome: 'Com Documento', cpf: '11122233344', telefone: '5512999995555' });
    assert.equal(r.codigo_cliente_omie, 55);
    assert.ok(!chamadas.some(c => c.call === 'ConsultarCliente' && 'codigo_cliente_integracao' in c.param));
  });
});

// === criaPedido — resolução de produto (SKU -> id interno do Omie) ===

test('criaPedido manda codigo_produto (id interno) resolvido via ConsultarProduto, nunca codigo_produto_integracao', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-000', () => comMock({
    ConsultarProduto: produtoStub({ REF01: { codigo_produto: 5777346172, ncm: '8421.99.99' } }),
    IncluirPedido: (param) => {
      assert.equal(param.cabecalho.codigo_pedido_integracao, 'pdv_abc123');
      assert.equal(param.cabecalho.etapa, '10');
      assert.equal(param.det[0].produto.codigo_produto, 5777346172);
      // Mutação-alvo: se o código voltar a mandar codigo_produto_integracao
      // (o SKU), este assert falha — o Omie nunca acha o produto por ali.
      assert.equal('codigo_produto_integracao' in param.det[0].produto, false);
      assert.equal(param.det[0].produto.ncm, '8421.99.99');
      assert.ok(!JSON.stringify(param).includes('9403.30.00'));
      return { numero_pedido: '5281', codigo_pedido: 991 };
    },
  }, async (chamadas) => {
    const r = await opdv.criaPedido('Tudo de Filtro', {
      idem: 'pdv_abc123', codigoCliente: 777,
      // ncm ausente do carrinho de propósito — reproduz o bug medido (o
      // catálogo do Zoho não traz NCM). O NCM enviado tem que vir só do
      // ConsultarProduto.
      itens: [{ codigo: 'REF01', descricao: 'Refil', qtd: 1, valor: 150 }],
      desconto: 0,
    });
    assert.equal(r.numero_pedido, '5281');
    assert.equal(chamadas[0].call, 'ConsultarProduto');
    assert.equal(chamadas[0].param.codigo, 'REF01');
  }));
});

test('criaPedido lanca erro claro identificando o item quando o produto nao tem cadastro no Omie', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-1', () => comMock({
    ConsultarProduto: produtoStub({}), // mapa vazio: nenhum SKU é encontrado
    IncluirPedido: () => { throw new Error('nao deveria montar pedido sem resolver o produto'); },
  }, async (chamadas) => {
    await assert.rejects(
      () => opdv.criaPedido('Tudo de Filtro', {
        idem: 'pdv_sem_produto', codigoCliente: 1,
        itens: [{ codigo: 'XPTO-999', descricao: 'Refil Fantasma', qtd: 1, valor: 10 }],
      }),
      (err) => {
        assert.match(err.message, /item 1 do carrinho/);
        assert.match(err.message, /Refil Fantasma/);
        assert.match(err.message, /XPTO-999/);
        return true;
      }
    );
    assert.ok(!chamadas.some(c => c.call === 'IncluirPedido'));
  }));
});

test('criaPedido identifica pelo indice e descricao certos quando o SEGUNDO item do carrinho falha', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-1', () => comMock({
    ConsultarProduto: produtoStub({ REF01: { codigo_produto: 1, ncm: '8421.99.99' } }),
    IncluirPedido: () => { throw new Error('nao deveria montar pedido sem resolver todos os produtos'); },
  }, async (chamadas) => {
    await assert.rejects(
      () => opdv.criaPedido('Tudo de Filtro', {
        idem: 'pdv_segundo_falha', codigoCliente: 1,
        itens: [
          { codigo: 'REF01', descricao: 'Refil', qtd: 1, valor: 150 },
          { codigo: 'FIL-SUMIU', descricao: 'Filtro Sumido', qtd: 1, valor: 89.9 },
        ],
      }),
      (err) => {
        assert.match(err.message, /item 2 do carrinho/);
        assert.match(err.message, /Filtro Sumido/);
        return true;
      }
    );
    assert.ok(!chamadas.some(c => c.call === 'IncluirPedido'));
  }));
});

test('criaPedido fixa os campos exigidos pelo Omie para venda de balcao, incluindo a parcela completa', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-777', () => comMock({
    ConsultarProduto: produtoStub({ A: { codigo_produto: 111, ncm: '1234.56.78' } }),
    IncluirPedido: (param) => {
      assert.equal(param.cabecalho.codigo_parcela, '999');
      assert.equal(param.frete.modalidade, '9');
      assert.equal(param.informacoes_adicionais.codigo_categoria, '1.01.03');
      assert.equal(param.informacoes_adicionais.enviar_email, 'N');
      assert.equal(param.informacoes_adicionais.consumidor_final, 'S');
      assert.equal(param.informacoes_adicionais.codigo_conta_corrente, 'CC-777');
      const parcela = param.lista_parcelas.parcela[0];
      assert.equal(parcela.percentual, 100);
      // Mutação-alvo: sem valor ou sem data_vencimento o Omie recusa o
      // pedido (medido: "[valor] é obrigatório!" e depois
      // "[data_vencimento] é obrigatório!"). Venda à vista de 1 item de
      // R$10 -> total líquido = 10.
      assert.equal(parcela.valor, 10);
      assert.equal(parcela.data_vencimento, param.cabecalho.data_previsao);
      assert.match(parcela.data_vencimento, /^\d{2}\/\d{2}\/\d{4}$/);
      return { numero_pedido: '1', codigo_pedido: 1 };
    },
  }, async () => {
    await opdv.criaPedido('Tudo de Filtro', {
      idem: 'pdv_fixos', codigoCliente: 1,
      itens: [{ codigo: 'A', descricao: 'Item A', qtd: 1, valor: 10 }],
    });
  }));
});

test('criaPedido monta det com mais de um item preservando ordem e dados, com produto de cada um', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-1', () => comMock({
    ConsultarProduto: produtoStub({
      REF01: { codigo_produto: 3001, ncm: '8421.99.99' },
      FIL02: { codigo_produto: 3002, ncm: '3824.99.99' },
    }),
    IncluirPedido: (param) => {
      assert.equal(param.det.length, 2);
      assert.equal(param.det[0].ide.codigo_item_integracao, '1');
      assert.equal(param.det[0].produto.codigo_produto, 3001);
      assert.equal(param.det[0].produto.ncm, '8421.99.99');
      assert.equal(param.det[0].produto.quantidade, 2);
      assert.equal(param.det[0].produto.valor_unitario, 150);
      assert.equal(param.det[1].ide.codigo_item_integracao, '2');
      assert.equal(param.det[1].produto.codigo_produto, 3002);
      assert.equal(param.det[1].produto.ncm, '3824.99.99');
      assert.equal(param.det[1].produto.quantidade, 1);
      assert.equal(param.det[1].produto.valor_unitario, 89.9);
      // total líquido = 2*150 + 1*89.9 = 389.9, sem desconto
      assert.equal(param.lista_parcelas.parcela[0].valor, 389.9);
      return { numero_pedido: '2', codigo_pedido: 2 };
    },
  }, async () => {
    await opdv.criaPedido('Tudo de Filtro', {
      idem: 'pdv_multi', codigoCliente: 1,
      itens: [
        { codigo: 'REF01', descricao: 'Refil', qtd: 2, valor: 150 },
        { codigo: 'FIL02', descricao: 'Filtro', qtd: 1, valor: 89.9 },
      ],
    });
  }));
});

test('criaPedido inclui valor_desconto e codigo_vendedor quando informados, e a parcela usa o total liquido', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-1', () => comMock({
    ConsultarProduto: produtoStub({ A: { codigo_produto: 1, ncm: '1234.56.78' } }),
    IncluirPedido: (param) => {
      assert.equal(param.informacoes_adicionais.valor_desconto, 25.5);
      assert.equal(param.cabecalho.codigo_vendedor, 42);
      // 1 item de R$100, desconto de 25.5 -> parcela paga o líquido, não o bruto.
      assert.equal(param.lista_parcelas.parcela[0].valor, 74.5);
      return { numero_pedido: '3', codigo_pedido: 3 };
    },
  }, async () => {
    await opdv.criaPedido('Tudo de Filtro', {
      idem: 'pdv_desconto', codigoCliente: 1,
      itens: [{ codigo: 'A', descricao: 'Item A', qtd: 1, valor: 100 }],
      desconto: 25.5, codVend: 42,
    });
  }));
});

test('criaPedido omite valor_desconto e codigo_vendedor quando nao informados', async () => {
  await comContaCorrente('Tudo de Filtro', 'CC-1', () => comMock({
    ConsultarProduto: produtoStub({ A: { codigo_produto: 1, ncm: '1234.56.78' } }),
    IncluirPedido: (param) => {
      assert.equal('valor_desconto' in param.informacoes_adicionais, false);
      assert.equal('codigo_vendedor' in param.cabecalho, false);
      assert.equal(param.lista_parcelas.parcela[0].valor, 1);
      return { numero_pedido: '4', codigo_pedido: 4 };
    },
  }, async () => {
    await opdv.criaPedido('Tudo de Filtro', {
      idem: 'pdv_sem_desconto', codigoCliente: 1,
      itens: [{ codigo: 'A', descricao: 'Item A', qtd: 1, valor: 1 }],
    });
  }));
});

// === faturaPedido/buscaNota NÃO EXISTEM MAIS ===
// Decisão do dono (19/ago/2026): o PDV não fatura. Emitir nota é o único
// passo do fluxo que não desfaz — ele quis manter um humano (a Eloize,
// manualmente, no Omie) nessa decisão em vez de automatizar. Sem chamador
// nenhum no código (bi-pdv.js não usa mais nenhuma das duas), as funções
// foram removidas — código morto não fica pra trás. Esta trava garante que
// uma reintrodução do faturamento automático (`FaturarPedido` ou
// `FaturarPedidoVenda`) não volta como função exportada sem que este teste
// quebre primeiro.
test('faturaPedido e buscaNota nao existem mais — quem fatura e a Eloize, manualmente, no Omie', () => {
  assert.equal('faturaPedido' in opdv, false);
  assert.equal('buscaNota' in opdv, false);
});

// === validarPedido — nunca fatura, nunca emite; só avisa ===
test('validarPedido chama ValidarPedidoVenda (nunca FaturarPedido/FaturarPedidoVenda) com o codigoPedido recebido', async () => {
  await comMock({ ValidarPedidoVenda: { cCodStatus: '0', cDescStatus: 'Não foi encontrado nenhum erro' } }, async (chamadas) => {
    const r = await opdv.validarPedido('Tudo de Filtro', 4821);
    assert.equal(r.ok, true);
    assert.equal(r.codStatus, '0');
    assert.equal(chamadas.length, 1);
    assert.equal(chamadas[0].endpoint, 'produtos/pedidovendafat/');
    assert.equal(chamadas[0].call, 'ValidarPedidoVenda');
    assert.equal(chamadas[0].param.nCodPed, 4821);
  });
});

// Medido contra a API real: pedido 5846036916, cliente sem e-mail no
// cadastro. cCodStatus e cDescStatus reproduzidos EXATAMENTE como a API
// devolveu — é este texto, verbatim, que a tela precisa mostrar pro
// operador (não uma paráfrase).
test('validarPedido devolve ok:false com cCodStatus e cDescStatus EXATOS medidos contra a API real (falta e-mail)', async () => {
  const DESC = 'Foram encontrados erros durante a validação dessa Pedido de Venda de Produto!'
    + '              Para emitir a NF-e falta preencher o E-mail.';
  await comMock({
    ValidarPedidoVenda: { cCodStatus: '1', cDescStatus: DESC },
  }, async () => {
    const r = await opdv.validarPedido('Tudo de Filtro', 5846036916);
    assert.equal(r.ok, false);
    assert.equal(r.codStatus, '1');
    assert.equal(r.descStatus, DESC, 'a mensagem do Omie tem que chegar intacta — nunca reescrita/resumida');
  });
});

test('validarPedido usa a empresa da venda (nota pelo CNPJ errado e problema fiscal)', async () => {
  await comMock({ ValidarPedidoVenda: { cCodStatus: '0', cDescStatus: '' } }, async (chamadas) => {
    await opdv.validarPedido('Mococa', 1);
    assert.equal(chamadas[0].empresa, 'Mococa');
  });
});

test('validarPedido propaga erro quando a propria chamada falha (rede/Omie fora) — quem chama decide o que fazer', async () => {
  await comMock({ ValidarPedidoVenda: new Error('omie ValidarPedidoVenda: Timeout na API') }, async () => {
    await assert.rejects(() => opdv.validarPedido('Tudo de Filtro', 1), /Timeout na API/);
  });
});

// ===========================================================================
// === ENDEREÇO DO CLIENTE EXISTENTE (pedido do dono, print de tela) ===
//
// Hoje o bloco de endereço SOME quando o operador seleciona um cliente já
// cadastrado — construído assim de propósito, mas sem chance nenhuma de
// conferir ou completar o que falta. buscarClienteOmie() é a busca READ-ONLY
// (nunca cria, nunca altera) usada pela tela assim que o operador ESCOLHE o
// cliente; garanteCliente() ganhou a regra de escrita: só preenche o que
// estava vazio, NUNCA sobrescreve o que já tinha valor.
//
// MUTAÇÕES alvo (mínimo exigido):
//  1) endereço do cliente existente deixar de ser carregado — os testes de
//     buscarClienteOmie abaixo quebram se o mapeamento de campos sumir ou
//     devolver undefined/vazio pro que a API devolveu preenchido.
//  2) atualização sobrescrever campo que já tinha valor — os testes de
//     "NAO sobrescreve" abaixo quebram se paramAlterar incluir um campo que
//     já tinha valor divergente, ou se a divergência sumir da lista.
//  3) DDD não ser separado do número — os testes de telefone1_ddd/numero
//     (criação e atualização) quebram se o código voltar a mandar o
//     telefone inteiro amontoado num campo só.
//  4) telefone fixo virar obrigatório — coberto no bi-pdv.test.js
//     (finalizarVenda aceita venda sem telefoneFixo).
// ===========================================================================

test('omie.separarDdd separa DDD e numero de um celular em E.164 (com codigo de pais)', () => {
  assert.deepStrictEqual(omie.separarDdd('5512988480749'), { ddd: '12', numero: '988480749' });
});

test('omie.separarDdd separa DDD e numero de um fixo sem codigo de pais (10 digitos)', () => {
  assert.deepStrictEqual(omie.separarDdd('1233334444'), { ddd: '12', numero: '33334444' });
});

test('omie.separarDdd devolve null quando nao da pra separar com confianca', () => {
  assert.equal(omie.separarDdd(''), null);
  assert.equal(omie.separarDdd(null), null);
  assert.equal(omie.separarDdd('123'), null);
  assert.equal(omie.separarDdd('5'.repeat(30)), null);
});

// === CRIAÇÃO — DDD separado do número (celular sempre; fixo só quando informado) ===

test('garanteCliente cria cliente novo com telefone1_ddd/telefone1_numero SEPARADOS, nunca o telefone inteiro num campo so', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      // Mutação-alvo: se o código voltar a mandar o telefone inteiro em
      // telefone1_numero (sem separar DDD), este assert quebra.
      assert.equal(param.telefone1_ddd, '12');
      assert.equal(param.telefone1_numero, '988480749');
      return { codigo_cliente_omie: 111 };
    },
  }, async () => {
    await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Ana', cpf: '12345678909', telefone: '5512988480749',
    });
  });
});

test('garanteCliente cria cliente novo com telefone2 (fixo) SEPARADO em DDD/numero quando informado', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      assert.equal(param.telefone1_ddd, '12');
      assert.equal(param.telefone1_numero, '988480749');
      assert.equal(param.telefone2_ddd, '12');
      assert.equal(param.telefone2_numero, '33334444');
      return { codigo_cliente_omie: 112 };
    },
  }, async () => {
    await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Ana', cpf: '12345678909', telefone: '5512988480749', telefoneFixo: '1233334444',
    });
  });
});

// Trava contra "telefone fixo virar obrigatório": sem telefoneFixo nenhum, a
// criação do cliente segue normal — o Omie nem recebe os campos telefone2_*.
test('garanteCliente cria cliente novo SEM telefone fixo normalmente — campo e opcional, nunca obrigatorio', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
    IncluirCliente: (param) => {
      assert.equal('telefone2_ddd' in param, false);
      assert.equal('telefone2_numero' in param, false);
      return { codigo_cliente_omie: 113 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Ana', cpf: '12345678909', telefone: '5512988480749',
    });
    assert.equal(r.codigo_cliente_omie, 113);
  });
});

// === buscarClienteOmie — leitura, NUNCA cria/altera ===

test('buscarClienteOmie por documento devolve a ficha completa (endereco, telefones separados, email)', async () => {
  await comMock({
    ListarClientes: (param) => {
      assert.equal(param.clientesFiltro.cnpj_cpf, '12345678909');
      return { clientes_cadastro: [{ codigo_cliente_omie: 5001 }] };
    },
    ConsultarCliente: (param) => {
      assert.equal(param.codigo_cliente_omie, 5001);
      return {
        codigo_cliente_omie: 5001,
        endereco: 'Rua das Flores', endereco_numero: '120', complemento: 'Apto 4',
        bairro: 'Centro', cidade: 'SAO JOSE DOS CAMPOS (SP)', estado: 'SP', cep: '12200-000',
        telefone1_ddd: '12', telefone1_numero: '988480749',
        telefone2_ddd: '12', telefone2_numero: '33334444',
        email: 'ana@exemplo.com',
      };
    },
  }, async () => {
    const r = await opdv.buscarClienteOmie('Tudo de Filtro', { cpf: '12345678909' });
    assert.equal(r.encontrado, true);
    assert.equal(r.codigoClienteOmie, 5001);
    assert.equal(r.endereco, 'Rua das Flores');
    assert.equal(r.numero, '120');
    assert.equal(r.complemento, 'Apto 4');
    assert.equal(r.bairro, 'Centro');
    // Mutação-alvo: cidade tem que vir SEM o sufixo "(UF)".
    assert.equal(r.cidade, 'SAO JOSE DOS CAMPOS');
    assert.equal(r.uf, 'SP');
    assert.equal(r.cep, '12200-000');
    assert.equal(r.telefoneCelularDdd, '12');
    assert.equal(r.telefoneCelularNumero, '988480749');
    assert.equal(r.telefoneFixoDdd, '12');
    assert.equal(r.telefoneFixoNumero, '33334444');
    assert.equal(r.email, 'ana@exemplo.com');
  });
});

test('buscarClienteOmie por telefone (sem documento) usa codigo_cliente_integracao', async () => {
  await comMock({
    ConsultarCliente: (param) => {
      assert.equal(param.codigo_cliente_integracao, 'pdv-5512999997777');
      return { codigo_cliente_omie: 8842, endereco: 'Rua X', bairro: 'Bairro X' };
    },
  }, async () => {
    const r = await opdv.buscarClienteOmie('Tudo de Filtro', { telefone: '5512999997777' });
    assert.equal(r.encontrado, true);
    assert.equal(r.endereco, 'Rua X');
  });
});

test('buscarClienteOmie devolve encontrado:false quando o cliente nao existe (documento)', async () => {
  await comMock({
    ListarClientes: new Error('omie ListarClientes: ERROR: Não existem registros para a página [1]!'),
  }, async () => {
    const r = await opdv.buscarClienteOmie('Tudo de Filtro', { cpf: '99988877766' });
    assert.deepStrictEqual(r, { encontrado: false });
  });
});

test('buscarClienteOmie devolve encontrado:false quando o cliente nao existe (telefone)', async () => {
  await comMock({
    ConsultarCliente: new Error('omie ConsultarCliente: ERROR: Cliente não cadastrado para o Código [0] !'),
  }, async () => {
    const r = await opdv.buscarClienteOmie('Tudo de Filtro', { telefone: '5512999996666' });
    assert.deepStrictEqual(r, { encontrado: false });
  });
});

test('buscarClienteOmie NUNCA cria nem altera cliente — so le', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 42 }] },
    ConsultarCliente: { codigo_cliente_omie: 42 },
    IncluirCliente: () => { throw new Error('buscarClienteOmie nao pode criar cliente'); },
    AlterarCliente: () => { throw new Error('buscarClienteOmie nao pode alterar cliente'); },
  }, async (chamadas) => {
    await opdv.buscarClienteOmie('Tudo de Filtro', { cpf: '12345678909' });
    assert.ok(!chamadas.some(c => c.call === 'IncluirCliente'));
    assert.ok(!chamadas.some(c => c.call === 'AlterarCliente'));
  });
});

// === garanteCliente — REGRA DE ESCRITA: só preenche o que estava vazio ===

test('garanteCliente PREENCHE endereco vazio de cliente existente (nunca cria cliente novo pra isso)', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 900 }] },
    ConsultarCliente: { codigo_cliente_omie: 900 }, // ficha SEM nenhum endereço/telefone
    IncluirCliente: () => { throw new Error('cliente ja existe — nao deveria criar'); },
    AlterarCliente: (param) => {
      assert.equal(param.codigo_cliente_omie, 900);
      assert.equal(param.endereco, 'Rua Nova');
      assert.equal(param.endereco_numero, '55');
      assert.equal(param.bairro, 'Bairro Novo');
      assert.equal(param.cidade, 'Bebedouro');
      assert.equal(param.estado, 'SP');
      return { codigo_cliente_omie: 900 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Cliente Antigo', cpf: '12345678909',
      endereco: 'Rua Nova', numero: '55', bairro: 'Bairro Novo', cidade: 'Bebedouro', uf: 'SP',
    });
    assert.equal(r.codigo_cliente_omie, 900);
    assert.ok(chamadas.some(c => c.call === 'AlterarCliente'));
    assert.deepStrictEqual(r.divergenciasEndereco, []);
  });
});

// Mutação-alvo central desta tarefa: cadastro JÁ TEM endereço, operador
// digita outro no balcão — o Omie NUNCA pode ser sobrescrito. Se o código
// regredir pra "sempre manda o que veio no payload", o dublê de
// AlterarCliente abaixo pega o campo `endereco` errado e o assert quebra.
test('garanteCliente NUNCA sobrescreve endereco que ja tinha valor — diferença vira divergencia, nao escrita', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 901 }] },
    ConsultarCliente: {
      codigo_cliente_omie: 901,
      endereco: 'Rua Antiga', endereco_numero: '10', bairro: 'Bairro Antigo', cidade: 'Bebedouro', estado: 'SP',
    },
    AlterarCliente: (param) => {
      assert.equal('endereco' in param, false, 'endereco ja tinha valor — nao pode entrar no AlterarCliente');
      assert.equal('endereco_numero' in param, false);
      assert.equal('bairro' in param, false);
      return { codigo_cliente_omie: 901 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Cliente Antigo', cpf: '98765432100',
      endereco: 'Rua Digitada Errada', numero: '999', bairro: 'Bairro Antigo', cidade: 'Bebedouro', uf: 'SP',
    });
    assert.equal(r.codigo_cliente_omie, 901);
    // Endereço e número divergem (cadastro != balcão) — viram divergência,
    // registrada pra observação da venda; bairro/cidade/uf batem, sem
    // divergência nenhuma pra eles.
    assert.equal(r.divergenciasEndereco.length, 2);
    assert.match(r.divergenciasEndereco.join(' | '), /endereço: cadastro tem "Rua Antiga".*balcão digitou "Rua Digitada Errada"/);
    assert.match(r.divergenciasEndereco.join(' | '), /número: cadastro tem "10".*balcão digitou "999"/);
  });
});

test('garanteCliente nao registra divergencia quando o valor digitado bate com o cadastro (so a formatacao muda)', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 902 }] },
    ConsultarCliente: { codigo_cliente_omie: 902, cidade: 'SAO JOSE DOS CAMPOS (SP)' },
    AlterarCliente: () => { throw new Error('nada deveria ser alterado — o valor digitado bate com o cadastro'); },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Fulano', cpf: '12345678909', cidade: 'SAO JOSE DOS CAMPOS',
    });
    assert.deepStrictEqual(r.divergenciasEndereco, []);
  });
});

test('garanteCliente NAO chama AlterarCliente quando nao ha nada pra preencher nem divergencia nenhuma', async () => {
  await comMock({
    ListarClientes: { clientes_cadastro: [{ codigo_cliente_omie: 903 }] },
    ConsultarCliente: { codigo_cliente_omie: 903 },
    AlterarCliente: () => { throw new Error('nao deveria chamar AlterarCliente sem nada pra atualizar'); },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro', { nome: 'Fulano', cpf: '12345678909' });
    assert.equal(r.codigo_cliente_omie, 903);
    assert.ok(!chamadas.some(c => c.call === 'AlterarCliente'));
  });
});

// === telefones (celular/fixo) na atualização — mesma regra de nao sobrescrever ===

test('garanteCliente PREENCHE telefone fixo vazio de cliente existente, com DDD separado', async () => {
  await comMock({
    ConsultarCliente: { codigo_cliente_omie: 904 }, // sem telefone2 nenhum
    AlterarCliente: (param) => {
      assert.equal(param.telefone2_ddd, '12');
      assert.equal(param.telefone2_numero, '33334444');
      return { codigo_cliente_omie: 904 };
    },
  }, async (chamadas) => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Sem Documento', telefone: '5512999997777', telefoneFixo: '1233334444',
    });
    assert.ok(chamadas.some(c => c.call === 'AlterarCliente'));
  });
});

test('garanteCliente NUNCA sobrescreve telefone fixo que ja tinha valor — diferenca vira divergencia', async () => {
  await comMock({
    ConsultarCliente: { codigo_cliente_omie: 905, telefone2_ddd: '11', telefone2_numero: '40001111' },
    AlterarCliente: (param) => {
      assert.equal('telefone2_ddd' in param, false);
      assert.equal('telefone2_numero' in param, false);
      return { codigo_cliente_omie: 905 };
    },
  }, async () => {
    const r = await opdv.garanteCliente('Tudo de Filtro', {
      nome: 'Sem Documento', telefone: '5512999997777', telefoneFixo: '1233334444',
    });
    assert.equal(r.divergenciasEndereco.length, 1);
    assert.match(r.divergenciasEndereco[0], /telefone fixo/);
    assert.match(r.divergenciasEndereco[0], /\(11\) 40001111/);
    assert.match(r.divergenciasEndereco[0], /\(12\) 33334444/);
  });
});
