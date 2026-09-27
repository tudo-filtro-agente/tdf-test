// lib/omie-pdv.js — a venda de balcão do lado do Omie.
//
// Ordem: garante cliente -> cria pedido -> valida.
// Decisão do dono (19/ago/2026): o PDV NÃO fatura. Emitir nota é o único
// passo do fluxo que não desfaz, e ele preferiu manter um humano nessa
// decisão em vez de automatizar — o pedido nasce na etapa "10" e fica
// aguardando faturamento manual da Eloize, no próprio Omie, exatamente como
// a integração antiga da empresa já funcionava. A Focus NFe também NÃO é
// chamada aqui (nunca foi).
//
// ValidarPedidoVenda (função abaixo) não fatura nem emite nada — só devolve
// se o Omie acha que o pedido está pronto pra virar nota, em português
// (cCodStatus/cDescStatus). Existe pra avisar o OPERADOR, com o cliente
// ainda na frente dele, do que falta pra Eloize conseguir emitir depois —
// não pra decidir se a venda fecha.

const omie = require('./omie');

// Busca a FICHA COMPLETA de um cliente já cadastrado, sem criar nem alterar
// nada — usada tanto por garanteCliente (write path, abaixo) quanto por
// buscarClienteOmie (read-only, mais abaixo). Devolve o registro cru do
// Omie (ConsultarCliente) ou null quando o cliente não existe ainda.
//
//   COM documento: ListarClientes + clientesFiltro acha o codigo_cliente_omie
//   (ConsultarCliente NÃO aceita cnpj_cpf — "Tag [CNPJ_CPF] não faz parte da
//   estrutura do tipo complexo", medido contra a API real); depois
//   ConsultarCliente(codigo_cliente_omie) traz a ficha INTEIRA — ListarClientes
//   sozinho só devolve resumo, sem endereço nem telefone.
//   SEM documento: ConsultarCliente(codigo_cliente_integracao) já devolve a
//   ficha inteira direto, mesma chave 'pdv-<telefone>' usada pra criar.
async function _buscaFichaExistente(empresa, doc, telefoneDigits) {
  if (doc) {
    let achado;
    try {
      achado = await omie.chamar(empresa, 'geral/clientes/', 'ListarClientes',
        { pagina: 1, registros_por_pagina: 5, clientesFiltro: { cnpj_cpf: doc } });
    } catch (e) {
      // "Não existem registros" é o Omie dizendo "cliente novo" — não é erro,
      // é o sinal para seguir e criar. Qualquer outro erro sobe.
      if (/nao existem registros|não existem registros/i.test(e.message)) return null;
      throw e;
    }
    const lista = (achado && achado.clientes_cadastro) || [];
    if (!lista.length || !lista[0].codigo_cliente_omie) return null;
    return await omie.chamar(empresa, 'geral/clientes/', 'ConsultarCliente',
      { codigo_cliente_omie: lista[0].codigo_cliente_omie });
  }
  if (!telefoneDigits) return null;
  try {
    return await omie.chamar(empresa, 'geral/clientes/', 'ConsultarCliente',
      { codigo_cliente_integracao: 'pdv-' + telefoneDigits });
  } catch (e) {
    if (/cliente n[aã]o cadastrado/i.test(e.message)) return null;
    throw e;
  }
}

// Campos de endereço/documento comparados entre o que já está no Omie
// (leitura de ConsultarCliente) e o que o operador digitou no balcão.
// `read`  = nome do campo devolvido por ConsultarCliente.
// `write` = nome do campo aceito por IncluirCliente/AlterarCliente.
//           ⚠️ 26/08/2026: este mapa dizia que "complemento" na leitura vira
//           "endereco_complemento" na gravação. ESTÁ ERRADO e derrubava TODA
//           criação de cliente novo no balcão, com a mensagem
//           "Tag [ENDERECO_COMPLEMENTO] não faz parte da estrutura do tipo
//           complexo [clientes_cadastro]". Na estrutura `clientes_cadastro`
//           do Omie o campo é `complemento` na leitura E na gravação.
// `limite` = mesmo truncamento já usado em IncluirCliente, preservado aqui.
const CAMPOS_ENDERECO = [
  { read: 'endereco', write: 'endereco', payload: 'endereco', rotulo: 'endereço', limite: 60 },
  { read: 'endereco_numero', write: 'endereco_numero', payload: 'numero', rotulo: 'número', limite: 20 },
  { read: 'complemento', write: 'complemento', payload: 'complemento', rotulo: 'complemento', limite: 60 },
  { read: 'bairro', write: 'bairro', payload: 'bairro', rotulo: 'bairro', limite: 60 },
  { read: 'cidade', write: 'cidade', payload: 'cidade', rotulo: 'cidade', limite: 60, normalizar: omie.limparCidade },
  { read: 'estado', write: 'estado', payload: 'uf', rotulo: 'UF', limite: 2 },
  { read: 'cep', write: 'cep', payload: 'cep', rotulo: 'CEP', limite: 15 },
  { read: 'email', write: 'email', payload: 'email', rotulo: 'e-mail', limite: 60 },
];

// Compara um telefone (celular OU fixo) do payload contra o par DDD/número
// já no cadastro. Só entra no `paramAlterar` quando o cadastro está VAZIO
// nos dois campos; se já tinha algo e é diferente do que o operador digitou,
// vira divergência — NUNCA sobrescreve.
function _comparaTelefone(achado, campoDdd, campoNumero, bruto, rotulo) {
  const partido = omie.separarDdd(bruto);
  if (!partido) return {}; // nada informado, ou não deu pra separar — não mexe
  const dddExistente = String(achado[campoDdd] == null ? '' : achado[campoDdd]).trim();
  const numExistente = String(achado[campoNumero] == null ? '' : achado[campoNumero]).trim();
  if (!dddExistente && !numExistente) {
    return { setar: { ddd: partido.ddd, numero: partido.numero } };
  }
  if (dddExistente === partido.ddd && numExistente === partido.numero) return {};
  return {
    divergencia: `telefone ${rotulo}: cadastro tem "(${dddExistente}) ${numExistente}", balcão digitou "(${partido.ddd}) ${partido.numero}" — cadastro mantido`,
  };
}

// Cliente já existe (achado = ficha COMPLETA de ConsultarCliente): nunca
// sobrescreve campo que já tinha valor. Só entra no AlterarCliente o que
// estava VAZIO no Omie e o operador preencheu agora; campo que já tinha
// valor diferente do digitado vira DIVERGÊNCIA (devolvida em
// `divergenciasEndereco`, pra quem chama registrar na observação da venda —
// nunca é gravada por cima do cadastro).
//
// Se não sobrar nenhum campo pra atualizar, AlterarCliente nem é chamado —
// evita escrita (e consumo de cota) sem necessidade nenhuma.
// Razão social que o balcão grava quando o operador não digita o nome. Ficha
// assim PODE ser renomeada numa venda futura que traga nome de verdade —
// mesma regra que já vale no Zoho (`ehNomeGenerico` em bi-pdv.js).
// Medido 17/09 no Omie: das 6 fichas criadas pelo PDV, as 2 SEM CPF estão como
// "Consumidor Final" — e a nota fiscal sai nesse nome. Pior: a busca por
// telefone reusa a ficha, então o cliente fica genérico PRA SEMPRE.
const RAZOES_GENERICAS = new Set(['consumidor final', 'consumidor', 'balcao', 'balcão']);

function ehRazaoGenerica(razao) {
  return RAZOES_GENERICAS.has(String(razao || '').trim().toLowerCase());
}

async function _reusaEAtualizaSeVazio(empresa, achado, cliente) {
  const paramAlterar = {};
  const divergenciasEndereco = [];

  for (const c of CAMPOS_ENDERECO) {
    const informadoBruto = cliente[c.payload];
    const informado = String(informadoBruto == null ? '' : informadoBruto).trim();
    if (!informado) continue; // operador não digitou nada nesse campo
    const existenteBruto = String(achado[c.read] == null ? '' : achado[c.read]).trim();
    const existente = c.normalizar ? c.normalizar(existenteBruto) : existenteBruto;
    const novo = c.normalizar ? c.normalizar(informado) : informado;
    if (!existente) {
      paramAlterar[c.write] = omie.truncar(novo, c.limite);
    } else if (existente !== novo) {
      divergenciasEndereco.push(`${c.rotulo}: cadastro tem "${existente}", balcão digitou "${novo}" — cadastro mantido`);
    }
  }

  // Ficha genérica ganha o nome de verdade. O laço acima só preenche campo
  // VAZIO — e "Consumidor Final" não está vazio, está errado; sem isto o
  // cliente nunca sairia do rótulo. NUNCA sobrescreve razão social de gente:
  // `ehRazaoGenerica` usa lista fechada.
  const nomeAgora = String(cliente.nome || '').trim();
  if (nomeAgora && !ehRazaoGenerica(nomeAgora) && ehRazaoGenerica(achado.razao_social)) {
    paramAlterar.razao_social = omie.truncar(nomeAgora, 60);
    paramAlterar.nome_fantasia = omie.truncar(nomeAgora, 50);
  }

  const tel1 = _comparaTelefone(achado, 'telefone1_ddd', 'telefone1_numero', cliente.telefone, 'celular');
  if (tel1.setar) { paramAlterar.telefone1_ddd = tel1.setar.ddd; paramAlterar.telefone1_numero = tel1.setar.numero; }
  if (tel1.divergencia) divergenciasEndereco.push(tel1.divergencia);

  const tel2 = _comparaTelefone(achado, 'telefone2_ddd', 'telefone2_numero', cliente.telefoneFixo, 'fixo');
  if (tel2.setar) { paramAlterar.telefone2_ddd = tel2.setar.ddd; paramAlterar.telefone2_numero = tel2.setar.numero; }
  if (tel2.divergencia) divergenciasEndereco.push(tel2.divergencia);

  if (Object.keys(paramAlterar).length) {
    paramAlterar.codigo_cliente_omie = achado.codigo_cliente_omie;
    await omie.chamar(empresa, 'geral/clientes/', 'AlterarCliente', paramAlterar);
  }

  return { ...achado, divergenciasEndereco };
}

async function garanteCliente(empresa, cliente) {
  const doc = String(cliente.cpf || cliente.cnpj || '').replace(/\D/g, '');
  const telefoneDigits = String(cliente.telefone || '').replace(/\D/g, '');
  const chaveIntegracao = 'pdv-' + (doc || telefoneDigits);

  const achado = await _buscaFichaExistente(empresa, doc, doc ? null : telefoneDigits);
  if (achado && achado.codigo_cliente_omie) {
    // O Omie devolve "SAO JOSE DOS CAMPOS (SP)" — limpa antes de qualquer
    // leitura/exibição/comparação pra quem consome o retorno de garanteCliente.
    if (achado.cidade) achado.cidade = omie.limparCidade(achado.cidade);
    return await _reusaEAtualizaSeVazio(empresa, achado, cliente);
  }

  const tel1 = omie.separarDdd(cliente.telefone);
  const tel2 = omie.separarDdd(cliente.telefoneFixo);
  const param = {
    codigo_cliente_integracao: chaveIntegracao,
    razao_social: omie.truncar(cliente.nome, 60),
    nome_fantasia: omie.truncar(cliente.nome, 50),
    cnpj_cpf: doc,
    // Omie separa DDD e número em campos distintos (medido contra a ficha
    // real: telefone1_ddd "12", telefone1_numero "988480749") — nunca o
    // telefone inteiro amontoado em telefone1_numero. Quando não dá pra
    // separar com confiança, os dois ficam vazios (nunca um número errado).
    telefone1_ddd: tel1 ? tel1.ddd : '',
    telefone1_numero: tel1 ? omie.truncar(tel1.numero, 20) : '',
    email: omie.truncar(cliente.email, 60),
    endereco: omie.truncar(cliente.endereco, 60),
    endereco_numero: omie.truncar(cliente.numero, 20),
    complemento: omie.truncar(cliente.complemento, 60),
    bairro: omie.truncar(cliente.bairro, 60),
    // Cidade limpa do sufixo "(UF)" antes de gravar — mandar de volta o que o
    // Omie já devolve formatado duplicaria/estragaria o dado no cadastro.
    cidade: omie.truncar(omie.limparCidade(cliente.cidade), 60),
    estado: omie.truncar(cliente.uf, 2),
    cep: omie.truncar(cliente.cep, 15),
  };
  // Telefone fixo é OPCIONAL — só entra no cadastro quando o operador de
  // fato digitou um (e deu pra separar DDD/número); nunca vira campo
  // obrigatório nem manda ddd/numero vazios por padrão.
  if (tel2) {
    param.telefone2_ddd = tel2.ddd;
    param.telefone2_numero = omie.truncar(tel2.numero, 20);
  }
  return await omie.chamar(empresa, 'geral/clientes/', 'IncluirCliente', param);
}

// === LEITURA da ficha do cliente, SEM criar nem alterar nada ===
// Pedido do dono depois de usar o PDV em produção (print de tela): ao
// selecionar um cliente já cadastrado, o bloco de endereço sumia por
// completo — sem chance de conferir nem de completar. Esta função busca a
// ficha completa (endereço, telefones separados em DDD/número, e-mail) pra
// tela mostrar assim que o operador ESCOLHE o cliente — nunca durante a
// digitação (mesma trava de "consumo redundante" de 60s que o resto do PDV
// já respeita). Reusa a MESMA busca de garanteCliente (_buscaFichaExistente)
// — nunca cria, nunca chama IncluirCliente/AlterarCliente.
async function buscarClienteOmie(empresa, { cpf, cnpj, telefone } = {}) {
  const doc = String(cpf || cnpj || '').replace(/\D/g, '');
  const telefoneDigits = String(telefone || '').replace(/\D/g, '');
  const achado = await _buscaFichaExistente(empresa, doc, doc ? null : telefoneDigits);
  if (!achado || !achado.codigo_cliente_omie) return { encontrado: false };
  return {
    encontrado: true,
    codigoClienteOmie: achado.codigo_cliente_omie,
    endereco: achado.endereco || '',
    numero: achado.endereco_numero || '',
    complemento: achado.complemento || '',
    bairro: achado.bairro || '',
    cidade: achado.cidade ? omie.limparCidade(achado.cidade) : '',
    uf: achado.estado || '',
    cep: achado.cep || '',
    telefoneCelularDdd: achado.telefone1_ddd || '',
    telefoneCelularNumero: achado.telefone1_numero || '',
    telefoneFixoDdd: achado.telefone2_ddd || '',
    telefoneFixoNumero: achado.telefone2_numero || '',
    email: achado.email || '',
  };
}

// Resolve o SKU do carrinho (vem do catálogo do Zoho, campo `codigo`) pro id
// interno do Omie. `codigo_produto_integracao` vem SEMPRE vazio no cadastro
// real — mandar o SKU ali nunca acha nada ("ERROR: Produto não cadastrado
// para o Código de Integração [...]"). ConsultarProduto com
// { codigo: <sku> } devolve `codigo_produto` (id interno, o que o
// IncluirPedido de fato usa) e `ncm` — o NCM É SEMPRE deste cadastro, nunca
// do carrinho (que às vezes nem carrega o campo) e nunca fixo no código
// (9403.30.00 é proibido).
async function resolveProduto(empresa, it, indice) {
  const rotulo = `item ${indice + 1} do carrinho (${it.descricao || it.codigo || 'sem descrição'}, código ${it.codigo})`;
  let p;
  try {
    p = await omie.chamar(empresa, 'geral/produtos/', 'ConsultarProduto', { codigo: it.codigo });
  } catch (e) {
    throw new Error(`${rotulo}: produto não encontrado no cadastro do Omie — ${e.message}`);
  }
  if (!p || !p.codigo_produto) {
    throw new Error(`${rotulo}: produto não encontrado no cadastro do Omie (resposta sem codigo_produto)`);
  }
  return p;
}

// Bloco "Outro Destinatario" do Omie — entrega num endereco que NAO e o do
// cadastro do cliente. Os campos sao sufixados `Od` (cEnderecoOd, cCidadeOd...).
//
// Devolve null quando nao ha entrega alternativa: a chave `outros_detalhes`
// entao nem entra no payload, e o pedido sai byte a byte igual ao de antes.
// Trunca nos mesmos limites do cadastro de cliente (medidos contra a API real
// em garanteCliente) — campo longo demais faz o Omie recusar o pedido inteiro.
function montaOutrosDetalhes(entrega) {
  if (!entrega) return null;
  const cidade = omie.limparCidade(entrega.cidade);
  // Sem logradouro nao ha entrega alternativa nenhuma pra declarar. Quem
  // exige o endereco COMPLETO e a validacao do servidor (lib/bi-pdv.js);
  // aqui o corte e so contra montar um bloco vazio.
  if (!String(entrega.endereco || '').trim()) return null;
  const od = {
    cEnderecoOd: omie.truncar(entrega.endereco, 60),
    cNumeroOd: omie.truncar(entrega.numero, 20),
    cComplementoOd: omie.truncar(entrega.complemento, 60),
    cBairroOd: omie.truncar(entrega.bairro, 60),
    cCidadeOd: omie.truncar(cidade, 60),
    cEstadoOd: omie.truncar(entrega.uf, 2),
    cCEPOd: omie.truncar(entrega.cep, 15),
  };
  // Nome e documento de quem RECEBE — opcionais. So entram quando o operador
  // de fato digitou (entrega em nome de terceiro: sindico, portaria, obra).
  const nome = String(entrega.nome || '').trim();
  if (nome) od.cNomeOd = omie.truncar(nome, 60);
  const doc = String(entrega.documento || '').replace(/\D/g, '');
  if (doc) od.cCnpjCpfOd = doc;
  return od;
}


async function criaPedido(empresa, { idem, codigoCliente, itens, desconto, codVend, entrega }) {
  const listaItens = itens || [];
  const det = [];
  for (let i = 0; i < listaItens.length; i++) {
    const it = listaItens[i];
    const p = await resolveProduto(empresa, it, i);
    det.push({
      ide: { codigo_item_integracao: String(i + 1) },
      produto: {
        codigo_produto: p.codigo_produto,
        descricao: omie.truncar(it.descricao, 120),
        // NCM SEMPRE do cadastro do produto no Omie. Nunca hardcode.
        ncm: p.ncm,
        quantidade: Number(it.qtd),
        valor_unitario: Number(it.valor),
      },
    });
  }

  // Venda de balcão é à vista: parcela única, vencendo na data da venda.
  const dataVenda = new Date().toLocaleDateString('pt-BR');
  // Total líquido da venda (soma dos itens menos o desconto) — o Omie exige
  // esse valor na parcela; sem ele: "O preenchimento da tag [valor] é
  // obrigatório!". Nunca negativo (desconto maior que o total é um bug em
  // outra camada, mas a parcela não pode virar dívida do cliente).
  const totalItens = det.reduce((s, d) => s + Number(d.produto.quantidade) * Number(d.produto.valor_unitario), 0);
  const valorLiquido = Math.round(Math.max(0, totalItens - Number(desconto || 0)) * 100) / 100;

  const param = {
    cabecalho: {
      codigo_pedido_integracao: idem,   // id do livro-razão = chave de idempotência
      codigo_cliente: codigoCliente,
      etapa: '10',
      codigo_parcela: '999',
      data_previsao: dataVenda,
    },
    frete: { modalidade: '9' },
    informacoes_adicionais: {
      codigo_categoria: '1.01.03',
      enviar_email: 'N',
      consumidor_final: 'S',
      codigo_conta_corrente: omie.contaCorrente(empresa),
    },
    det,
    // valor e data_vencimento são obrigatórios (medido contra a API real:
    // sem valor -> "O preenchimento da tag [valor] é obrigatório!"; com
    // valor mas sem data_vencimento -> "...[data_vencimento] é
    // obrigatório!"). Vencimento = data da venda (à vista, sem parcelamento).
    lista_parcelas: { parcela: [{ numero_parcela: 1, percentual: 100, valor: valorLiquido, data_vencimento: dataVenda }] },
  };
  if (desconto) param.informacoes_adicionais.valor_desconto = Number(desconto);
  if (codVend) param.cabecalho.codigo_vendedor = codVend;
  // Entrega em endereco DIFERENTE do cadastro do cliente (pedido do dono,
  // 24/ago/2026): o Omie chama isso de "Outro Destinatario" e recebe no bloco
  // `outros_detalhes`, com os campos sufixados `Od`. Sem entrega o payload
  // sai IDENTICO ao de antes — a chave nem aparece, entao nenhum pedido que
  // ja funcionava muda de forma.
  const od = montaOutrosDetalhes(entrega);
  if (od) param.outros_detalhes = od;
  return await omie.chamar(empresa, 'produtos/pedido/', 'IncluirPedido', param);
}

// Valida o pedido no Omie — nunca fatura, nunca emite nada. Devolve o status
// e a mensagem EXATAMENTE como o Omie mandou (cCodStatus, cDescStatus), em
// português — é essa mensagem que a tela mostra pro operador, verbatim, sem
// reescrever nem resumir; ela é a instrução de que faltou pra emitir a NF-e.
//
// Medido contra a API real no pedido 5846036916 (cliente sem e-mail no
// cadastro): cCodStatus "1", cDescStatus "Foram encontrados erros durante a
// validação dessa Pedido de Venda de Produto! Para emitir a NF-e falta
// preencher o E-mail." — "0" é o código de "sem erro encontrado" (a mesma
// convenção do Omie usada em `codigo_status` de outros serviços desta
// integração; SÓ o valor "1", com a mensagem acima, foi de fato medido).
async function validarPedido(empresa, codigoPedido) {
  const r = await omie.chamar(empresa, 'produtos/pedidovendafat/', 'ValidarPedidoVenda',
    { nCodPed: codigoPedido });
  return {
    ok: String(r && r.cCodStatus) === '0',
    codStatus: r && r.cCodStatus,
    descStatus: r && r.cDescStatus,
  };
}

// ── CATALOGO DO OMIE, em memoria ────────────────────────────────────────────
// Por que cache e nao busca ao vivo: o Omie BLOQUEIA por consumo indevido —
// ~50 chamadas seguidas custaram 260 segundos de bloqueio (medido 28/08).
// Buscar a cada tecla digitada derrubaria o PDV inteiro. O catalogo ativo tem
// ~717 produtos nas duas contas: cabe na memoria e muda pouco.
const _cat = new Map();          // empresa -> { em: timestamp, itens: [...] }
const CATALOGO_TTL_MS = 15 * 60 * 1000;

function _desescapa(t) {
  // O Omie devolve a descricao com entidade HTML: 20&quot; -> 20"
  return String(t || '')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
}

// Lista os produtos ATIVOS e COM CODIGO de uma conta do Omie. Produto sem
// codigo nao serve: o pedido do Omie e montado por codigo.
async function catalogoOmie(empresa, { agora = Date.now() } = {}) {
  const cache = _cat.get(empresa);
  if (cache && (agora - cache.em) < CATALOGO_TTL_MS) return cache.itens;

  const itens = [];
  let pagina = 1, total = 1;
  while (pagina <= total && pagina <= 40) {   // teto de seguranca
    const r = await omie.chamar(empresa, 'geral/produtos/', 'ListarProdutos', {
      pagina, registros_por_pagina: 50,
      apenas_importado_api: 'N', filtrar_apenas_omiepdv: 'N',
    });
    total = Number(r && r.total_de_paginas) || 1;
    for (const x of (r && r.produto_servico_cadastro) || []) {
      const codigo = String(x.codigo || '').trim();
      if (!codigo) continue;
      if (String(x.inativo || 'N').toUpperCase() === 'S') continue;
      itens.push({
        codigo,
        nome: _desescapa(x.descricao),
        preco: Number(x.valor_unitario || 0),
        ncm: x.ncm || '',
      });
    }
    pagina += 1;
  }
  _cat.set(empresa, { em: agora, itens });
  return itens;
}

// Busca por palavra dentro do catalogo. Todas as palavras da consulta precisam
// aparecer — "refil 20" acha "REFIL CARBON BLOCK 20\"", nao qualquer refil.
function filtraCatalogo(itens, termo, limite = 30) {
  const t = String(termo || '').trim().toLowerCase();
  if (t.length < 2) return [];
  const palavras = t.split(/\s+/).filter(Boolean);
  const out = [];
  for (const it of itens || []) {
    const alvo = (it.nome + ' ' + it.codigo).toLowerCase();
    if (palavras.every(p => alvo.includes(p))) {
      out.push(it);
      if (out.length >= limite) break;
    }
  }
  return out;
}

module.exports = { ehRazaoGenerica, catalogoOmie, filtraCatalogo, garanteCliente, buscarClienteOmie, criaPedido, validarPedido, montaOutrosDetalhes };
