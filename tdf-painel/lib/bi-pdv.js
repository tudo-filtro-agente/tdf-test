// lib/bi-pdv.js — Helpers do PDV (Ponto de Venda balcão)
//
// Busca cliente/produto direto no Zoho CRM.
// Finaliza venda: Omie cria o pedido (o PDV NÃO fatura — decisão do dono,
// 19/ago/2026: emitir nota é o único passo do fluxo que não desfaz, e ele
// preferiu manter um humano nessa decisão, a Eloize, manualmente, no Omie,
// depois — exatamente como a integração antiga já funcionava). Antes de
// devolver, o pedido é VALIDADO (ValidarPedidoVenda) — não pra decidir se a
// venda passa, mas pra avisar o operador, com o cliente ainda na frente
// dele, do que falta pra Eloize conseguir emitir a nota depois. A Focus NFe
// e o recebimento no BI NUNCA são chamados aqui, sob pena de nota duplicada
// e receita contada duas vezes. O Zoho (Contato + Deal + Quote) é gravado
// DEPOIS, e sua falha não derruba a venda: o cliente já foi embora com o
// pedido feito.
//
// MODO SOMBRA (TDF_PDV_MODO_SOMBRA=1): trava verificada antes de qualquer
// chamada externa (Omie e Zoho). Valida normalmente, grava no livro-razão o
// que faria, e não chama nada — é a garantia de que o dia de teste em
// paralelo com o sistema atual não cria pedido nem escreve no CRM em dobro.

const zoho = require('./zoho');
const ledger = require('./pdv-ledger');
const opdv = require('./omie-pdv');
const pagamentos = require('./bi-pagamentos'); // só auditoria
const pdvWeb = require('./pdv-web'); // fonte única do teto de desconto e da checagem de autorização

// === BUSCA CLIENTE ===
// Estratégia: usar word search da API Zoho (mais robusta que criteria
// quando os dados estão "sujos", ex: Last_Name="." em muitos contatos
// importados). word busca em TODOS os campos texto do módulo.
//
// q pode ser: email (tem @), telefone (≥8 dígitos), ou nome (texto livre).
// - email/phone: critério exato (mais preciso)
// - nome: word search (acha em qualquer campo)
async function buscarContato(q) {
  const query = String(q||'').trim();
  if (query.length < 2) return [];

  const onlyDigits = query.replace(/\D/g,'');
  const isEmail    = query.includes('@');
  const isPhone    = !isEmail && onlyDigits.length >= 8 && onlyDigits.length <= 13 && /^\d+$/.test(onlyDigits);

  const results = [];
  const seen = new Set();
  const addResult = (r) => {
    const k = r.modulo + '_' + r.id;
    if (seen.has(k)) return;
    seen.add(k);
    results.push(r);
  };

  const promises = [];

  if (isEmail) {
    // Email exato — usa email parameter dedicado da Zoho API
    const tryEmail = async (modulo) => {
      try {
        const token = await zoho.getToken();
        if (!token) return [];
        const url = `${zoho.BASE}/${modulo}/search?email=${encodeURIComponent(query)}&fields=Last_Name,First_Name,Phone,Mobile,Email,Account_Name,Company`;
        const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
        if (!r.ok) return [];
        const j = await r.json().catch(() => ({}));
        return j.data || [];
      } catch(e) { return []; }
    };
    promises.push(tryEmail('Contacts').then(rs => ({ modulo:'Contacts', recs:rs })));
    promises.push(tryEmail('Leads').then(rs => ({ modulo:'Leads', recs:rs })));
  } else if (isPhone) {
    // Telefone — searchByPhone (API tem param phone dedicado)
    try {
      const deals = await zoho.searchByPhone(onlyDigits, 'Deal_Name,Telefone_contato,Contact_Name,Account_Name,Stage');
      for (const d of (deals||[])) {
        if (d.Contact_Name?.id) {
          addResult({ id: d.Contact_Name.id, modulo:'Contacts',
            nome: d.Contact_Name.name || d.Deal_Name, telefone: d.Telefone_contato||'',
            email: '', empresa: d.Account_Name?.name || '', via:'Deal' });
        } else if (d.id) {
          addResult({ id: d.id, modulo:'Deals',
            nome: d.Deal_Name, telefone: d.Telefone_contato||'',
            empresa: d.Account_Name?.name || '', stage: d.Stage });
        }
      }
    } catch(e) { console.warn('[pdv buscar Phone]', e.message); }
    // Também usa o phone parameter dedicado da Zoho (busca em todos campos phone)
    const tryPhone = async (modulo) => {
      try {
        const token = await zoho.getToken();
        if (!token) return [];
        const url = `${zoho.BASE}/${modulo}/search?phone=${encodeURIComponent(onlyDigits)}&fields=Last_Name,First_Name,Phone,Mobile,Email,Account_Name,Company`;
        const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
        if (!r.ok) return [];
        const j = await r.json().catch(() => ({}));
        return j.data || [];
      } catch(e) { return []; }
    };
    promises.push(tryPhone('Contacts').then(rs => ({ modulo:'Contacts', recs:rs })));
    promises.push(tryPhone('Leads').then(rs => ({ modulo:'Leads', recs:rs })));
  } else {
    // Nome / texto livre → word search (busca em todos campos texto)
    // Doc: word=valor procura mín 2 chars em todos campos searchable
    promises.push(zoho.searchModuleWord('Contacts', query, 'Last_Name,First_Name,Phone,Mobile,Email,Account_Name', { perPage: 30 }).then(rs => ({ modulo:'Contacts', recs:rs })));
    promises.push(zoho.searchModuleWord('Accounts', query, 'Account_Name,Phone,Website', { perPage: 20 }).then(rs => ({ modulo:'Accounts', recs:rs })));
    promises.push(zoho.searchModuleWord('Leads',    query, 'Last_Name,First_Name,Phone,Mobile,Email,Company', { perPage: 20 }).then(rs => ({ modulo:'Leads', recs:rs })));
    promises.push(zoho.searchModuleWord('Deals',    query, 'Deal_Name,Telefone_contato,Contact_Name,Account_Name,Stage', { perPage: 20 }).then(rs => ({ modulo:'Deals', recs:rs })));
  }

  // Aguarda todas
  const all = await Promise.allSettled(promises);
  for (const p of all) {
    if (p.status !== 'fulfilled') continue;
    const { modulo, recs } = p.value || {};
    if (!Array.isArray(recs)) continue;
    for (const c of recs) {
      if (modulo === 'Contacts') {
        addResult({
          id: c.id, modulo: 'Contacts',
          nome: [c.First_Name, c.Last_Name].filter(x => x && x !== '.').join(' ').trim() || c.First_Name || c.Last_Name || '—',
          telefone: c.Mobile || c.Phone || '',
          email: c.Email || '',
          empresa: c.Account_Name?.name || '',
        });
      } else if (modulo === 'Accounts') {
        addResult({
          id: c.id, modulo: 'Accounts',
          nome: c.Account_Name || '—',
          telefone: c.Phone || '', email: '',
          empresa: c.Account_Name || '',
          website: c.Website || '',
        });
      } else if (modulo === 'Leads') {
        addResult({
          id: c.id, modulo: 'Leads',
          nome: [c.First_Name, c.Last_Name].filter(x => x && x !== '.').join(' ').trim() || c.First_Name || c.Last_Name || c.Company || '—',
          telefone: c.Mobile || c.Phone || '',
          email: c.Email || '',
          empresa: c.Company || '',
        });
      } else if (modulo === 'Deals') {
        addResult({
          id: c.id, modulo: 'Deals',
          nome: c.Deal_Name || '—',
          telefone: c.Telefone_contato || '',
          empresa: c.Account_Name?.name || '',
          stage: c.Stage || '',
        });
        if (c.Contact_Name?.id) {
          addResult({
            id: c.Contact_Name.id, modulo: 'Contacts',
            nome: c.Contact_Name.name || '—',
            telefone: c.Telefone_contato || '',
            empresa: c.Account_Name?.name || '',
            via: 'via Deal',
          });
        }
      }
    }
  }

  const ordemModulo = { 'Contacts': 0, 'Accounts': 1, 'Leads': 2, 'Deals': 3 };
  results.sort((a,b) => (ordemModulo[a.modulo] ?? 9) - (ordemModulo[b.modulo] ?? 9));
  return results.slice(0, 25);
}

// === BUSCA PRODUTO ===
// Mesmo problema do Contacts: dados podem ter Product_Code vazio etc.
// Word search é mais robusto.
async function buscarProduto(q, empresa) {
  const query = String(q||'').trim();
  if (query.length < 2) return [];
  const fields = 'Product_Name,Product_Code,Unit_Price,Description,Qty_in_Stock';

  // 1) Zoho — é dele que vem o `id`, que a linha do Orçamento precisa.
  let doZoho = [];
  try {
    doZoho = (await zoho.searchModuleWord('Products', query, fields, { perPage: 30 }) || [])
      .map(marcaVendavel);
  } catch (e) { console.warn('[pdv buscarProduto zoho]', e.message); }

  // 2) Omie — a fonte FISCAL. Produto que só existe lá era invisível pro
  // balcão: o operador procurava e não achava, mesmo o produto existindo no
  // ERP (medido 02/09: 74 produtos ativos no Omie fora do Zoho — refis, kits,
  // bebedouros, peças). Sem `id` do Zoho ainda; ele é criado na hora da venda.
  let doOmie = [];
  try {
    const cat = await opdv.catalogoOmie(empresa || 'Tudo de Filtro');
    doOmie = opdv.filtraCatalogo(cat, query).map(x => ({
      id: null, origem: 'omie', codigo: x.codigo, vendavel: true,
      nome: x.nome, preco: Number(x.preco || 0), estoque: 0, descricao: '',
    }));
  } catch (e) { console.warn('[pdv buscarProduto omie]', e.message); }

  return mesclaProdutos(doZoho, doOmie);
}

// Junta os dois catálogos SEM duplicar. O Zoho ganha quando os dois têm o
// mesmo código: só ele traz o `id` que o Orçamento precisa. Produto do Zoho
// SEM código não tem como ser cruzado — fica na lista (riscado) do jeito que
// já estava.
function mesclaProdutos(doZoho = [], doOmie = []) {
  const chave = c => String(c || '').trim().toUpperCase();
  const vistos = new Set(doZoho.map(p => chave(p.codigo)).filter(Boolean));
  const extras = doOmie.filter(p => chave(p.codigo) && !vistos.has(chave(p.codigo)));
  return [...doZoho, ...extras];
}


// === FINALIZAR VENDA ===
// Body: { idem, empresa, clienteZohoId, clienteNome, telefone, cpf, cnpj, email,
//         endereco, numero, bairro, cidade, uf, cep, origem, itens, frete,
//         desconto, formaPagamento }
//
// Fluxo: valida (inclui formato de email, se preenchido) → abre no
// livro-razão → (SOMBRA? para aqui) → Omie (cria o pedido, valida — NUNCA
// fatura) → Zoho (Contato + Deal + Quote, falha não derruba) → confirma
// 'completa' relendo o Deal E o Orçamento no CRM. 'completa' não depende
// da nota fiscal — ela não é mais responsabilidade do PDV.

// Teto do OPERADOR (regra do dono, 18/ago/2026: caiu de 10% para 5%). Acima
// disso a venda só passa com autorização de supervisor JÁ VERIFICADA pelo
// servidor (server.js chama lib/pdv-web.js#tratarFinalizarVenda, que roda
// verificarAutorizacaoDescontoComLimite ANTES de chamar finalizarVenda — a
// senha nunca chega aqui). Com autorização válida NÃO HÁ TETO: qualquer
// desconto passa. A lista de quem pode autorizar mora em lib/pdv-web.js
// (AUTORIZADORES_DESCONTO) — um lugar só.
//
// O NÚMERO em si (5) só existe em lib/pdv-web.js — importado aqui, nunca
// redeclarado — pra mensagem, cálculo e tela (via /pdv/api/setup) nunca
// desincronizarem quando o dono mudar o teto de novo.
const { DESCONTO_MAX_PCT_OPERADOR } = pdvWeb;
const OWNER_MARKETING_ID = process.env.ZOHO_OWNER_MARKETING_ID || '';
const LAYOUT_LOJA_ID = '6311862000101582231';

// Funil onde a venda de balcão cai. Pedido do dono (01/set): "quando sobe a
// venda do edson no pdv tem que subir pro funil base".
// Antes disso a venda nascia com `Pipeline` VAZIO — medido: 5 das 6 vendas de
// balcão sem funil nenhum. Venda fora de funil não aparece em relatório de
// funil, e foi por isso que a loja sumia do painel.
//
// 🚨 O NOME TEM ERRO DE DIGITAÇÃO NO CRM — é "Fúnil Base", com acento no U.
// E o picklist MENTE de novo: declara actual='Pipeline Teste 2 (Bebedouro)',
// mas o filtro só aceita o RÓTULO. Medido 01/09:
//   (Pipeline:equals:Fúnil Base)                   -> devolve registros
//   (Pipeline:equals:Pipeline Teste 2 (Bebedouro)) -> INVALID_QUERY
// Canário no card "Balcão — Celso Luis Vitor" (layout Loja): gravou o funil e
// a etapa 'Fechado Ganho' ficou intacta. Não trocar por "Funil Base" sem
// acento nem pelo actual_value — some do funil em silêncio.
const PIPELINE_BALCAO = 'Fúnil Base';

const ORIGEM_CANAL = {
  'Já é cliente / veio trocar refil': 'Base/CRM',
  'Indicação de amigo ou parente': 'Indicação',
  'Passou em frente / viu a loja': 'Direto',
  'Pesquisou no Google': 'Orgânico',
  'Viu no Instagram ou Facebook': 'Orgânico',
  'Recebeu mensagem nossa no WhatsApp': 'Base/CRM',
  'Viu placa, carro ou adesivo': 'Direto',
};

// Normaliza para E.164 pelo COMPRIMENTO, nunca pelo prefixo: testar
// `startsWith('55')` trata um número de Santa Maria/RS (DDD 55, ex.:
// 5532223333) como se já tivesse código de país e devolve o número sem o 55
// na frente — o cliente some do relógio de troca de refil.
//   10 dígitos = DDD + 8  |  11 = DDD + 9   → falta o país, prefixa 55
//   12 = 55 + DDD + 8     |  13 = 55 + DDD + 9 → já está em E.164
function _telefoneE164(bruto) {
  const d = String(bruto || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) return '55' + d;
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) return d;
  return null;
}

// === EMAIL — validado quando preenchido, nunca bloqueia por ausência ===
// Regra simples e suficiente pra pegar o caso real: "edson" digitado no
// campo email (venda de balcão que falhou em produção, dono reportou "erro
// na UF do cadastro" antes, e este outro bug depois). Não tenta cobrir RFC
// 5322 inteiro — só recusa o que obviamente não é um e-mail (sem @, sem
// domínio com ponto).
function _emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// === QUEM É O CLIENTE NO CRM (Contato) ===
// A busca do PDV devolve resultado de QUATRO módulos — Contatos, Empresas,
// Leads e Negócios — e a tela pinta um badge pra cada um. O id sozinho é
// ambíguo, e `Contact_Name` é lookup do módulo CONTATOS: mandar ali um id de
// Empresa, de Lead ou de Negócio faz o createDeal estourar, cair no catch do
// Zoho, e a venda ficar SEM Negócio e SEM Orçamento (sai no Omie, some do
// CRM). Três dos quatro tipos de resultado davam nisso. Por isso o módulo
// viaja junto com o id (`clienteZohoModulo`) e cada caso usa o lookup certo:
//
//   Contacts -> reusa o id direto no Contact_Name do Negócio (caso feliz).
//   Accounts -> o id vai pro Account_Name (o lookup do módulo Empresas, que é
//               o dele) e a PESSOA é resolvida pelo telefone; o Contato criado
//               nasce amarrado nessa empresa.
//   Leads    -> o id NÃO entra em lookup nenhum. Converter Lead é outra
//   Deals       operação do CRM, e id de Negócio não tem lookup dentro de um
//               Negócio novo. Decisão: tratar como CLIENTE NOVO e resolver
//               pelo telefone — nunca mandar id de módulo errado.
//   sem módulo / sem id (venda "sem cadastro") -> também pelo telefone.
//
// "Resolver pelo telefone" é o que o spec manda e o que faltava na branch:
// busca Contato pelo telefone E.164; achou, reusa; não achou, CRIA com nome,
// telefone, documento e endereço. Sem esse Contato o cliente do balcão não
// existe como PESSOA no CRM e nunca entra no relógio de troca de refil — que
// é a razão de ser do PDV inteiro.
async function _resolveClienteZoho(payload, telefone) {
  const modulo = payload.clienteZohoModulo || null;
  const id = payload.clienteZohoId || null;
  if (modulo === 'Contacts' && id) return { contatoId: id, contaId: null, criado: false };

  const contaId = (modulo === 'Accounts' && id) ? id : null;

  const achados = await zoho.searchModulePhone('Contacts', telefone, 'Last_Name,First_Name,Phone,Mobile');
  const achado = (achados || []).find(c => c && c.id);
  if (achado) {
    // O contato existe, mas pode estar batizado de "Consumidor Final" — foi
    // uma venda anterior em que o operador não digitou o nome. Se AGORA veio
    // nome, o cliente ganha nome. Sem isso ele fica genérico pra sempre:
    // some da busca por nome e nunca entra na régua de troca de refil como
    // pessoa. Caso real 31/08: a venda das 14:21 criou "Consumidor Final" e a
    // das 14:28, já com o nome do Celso, reaproveitou o contato sem renomear.
    // NUNCA sobrescreve nome existente — só troca o rótulo genérico.
    const nomeAgora = String(payload.clienteNome || '').trim();
    if (nomeAgora && ehNomeGenerico(achado)) {
      try {
        await zoho.updateContact(achado.id, nomeParaContato(nomeAgora));
      } catch (e) {
        // Renomear é melhoria, não pode derrubar a venda.
        console.warn('[pdv renomeia contato]', e.message);
      }
    }
    return { contatoId: achado.id, contaId, criado: false };
  }

  // Sem nome na tela o Contato nasce como "Consumidor Final" INTEIRO no
  // Last_Name — quebrar o rótulo em First/Last criaria um "Consumidor" de
  // sobrenome "Final" na base, que é sujeira, não pessoa.
  const nome = String(payload.clienteNome || '').trim();
  const doc = String(payload.cpf || payload.cnpj || '').replace(/\D/g, '');
  const campos = {
    ...nomeParaContato(nome),
    Phone: telefone,
    Mobile: telefone,
    Lead_Source: 'Visita na loja',
  };
  if (payload.email) campos.Email = payload.email;
  // CNPJ_CPF (texto), nunca CPF_CNPJ (bigint): o módulo Contatos desta org não
  // tem campo `CPF` — e o par numérico perde o zero à esquerda do CPF, o que
  // troca o documento da pessoa. Só dígitos, coerente com o Omie (omie-pdv.js).
  if (doc) campos.CNPJ_CPF = doc;
  // Bairro e complemento têm campo PRÓPRIO em Contatos (`Bairro`, `Complemento`)
  // — antes iam concatenados dentro de Mailing_Street, o que impede usar o
  // bairro pra roteirizar entrega depois. Número continua na rua: Contatos não
  // tem campo de número.
  const rua = [payload.endereco, payload.numero].filter(Boolean).join(', ');
  if (rua) campos.Mailing_Street = rua;
  if (payload.bairro) campos.Bairro = payload.bairro;
  if (payload.complemento) campos.Complemento = payload.complemento;
  if (payload.cidade) campos.Mailing_City = payload.cidade;
  if (payload.uf) campos.Mailing_State = payload.uf;
  if (payload.cep) campos.Mailing_Zip = payload.cep;
  if (contaId) campos.Account_Name = { id: contaId };

  const novo = await zoho.createContact(campos);
  return { contatoId: novo && novo.id ? novo.id : null, contaId, criado: true };
}

// `autorizacaoDesconto` é o resultado JÁ VERIFICADO pelo servidor (server.js
// chama lib/pdv-web.js#verificarAutorizacaoDesconto ANTES de chamar esta
// função, contra o registro USERS e a lista de autorizadores) — nunca uma
// credencial crua. Formato: { ok:true, autorizador, nomeAutorizador } quando
// válida, ou { ok:false, erro } (ou undefined/null, se a tela nem tentou)
// quando não.
async function finalizarVenda(payload, who, autorizacaoDesconto) {
  const itens = (payload.itens || []).filter(it => it && Number(it.qtd) > 0 && Number(it.valor) >= 0);
  if (!itens.length) return { ok: false, etapa: 'validacao-itens', erro: 'sem itens' };

  // Telefone obrigatório e em E.164 — sem ele o cliente do balcão nunca entra
  // no relógio de troca de refil, e a venda vira dado cego.
  const telefone = _telefoneE164(payload.telefone);
  if (!telefone) return { ok: false, etapa: 'validacao-telefone', erro: 'telefone obrigatório e inválido — corrija para fechar' };

  // === EMAIL — formato validado quando preenchido, NUNCA bloqueia por estar vazio ===
  // Desde a mudança de escopo de 19/ago/2026 (o PDV não fatura mais — quem
  // emite a nota é a Eloize, manualmente, depois), o e-mail não trava mais a
  // venda: o cliente pode ir embora sem ele. Mas é o e-mail que destrava a
  // emissão dela (medido contra a API real: ValidarPedidoVenda recusa sem
  // ele — ver opdv.validarPedido, chamado mais abaixo), e o print da venda
  // real que motivou este conserto tinha "edson" (sem @, claramente não um
  // e-mail) digitado no campo. Formato obviamente errado é recusado AQUI,
  // no servidor — a tela é só conveniência, quem contorna ainda bate nesta
  // recusa. Vazio passa direto: é o aviso da validação do Omie, mais
  // abaixo, que avisa o operador — não esta checagem de formato.
  const email = String(payload.email || '').trim();
  if (email && !_emailValido(email)) {
    return {
      ok: false, etapa: 'validacao-email',
      erro: `email "${email}" inválido — use o formato nome@dominio.com, ou deixe em branco`,
    };
  }

  // === ENDEREÇO OBRIGATÓRIO PARA CLIENTE NOVO ===
  // Bug real reportado pelo dono numa venda de balcão: "erro na UF do
  // cadastro". lib/omie-pdv.js SEMPRE mandou `estado: omie.truncar(cliente.uf,
  // 2)` pro Omie na criação do cliente — mas a tela nunca coletava endereço
  // nenhum, `cliente.uf` chegava `undefined`, virava '' e o Omie recusava.
  //
  // Regra do dono (18/ago/2026), decidida conscientemente com o custo de
  // tempo que ela impõe: base completa de endereço, pra roteirização e pra
  // saber de onde vem o cliente do balcão.
  //
  //   1. Só CLIENTE NOVO — `payload.clienteZohoId` presente (achado na busca
  //      do CRM, qualquer módulo: Contato, Empresa, Lead ou Negócio) já tem
  //      endereço no Omie de uma venda anterior; perguntar de novo é atrito
  //      puro no caso mais comum do balcão (cliente que volta pra trocar
  //      refil).
  //   2. Saída manual obrigatória — o requisito é TER endereço, nunca TER
  //      vindo do ViaCEP. CEP é o único campo de fora da obrigatoriedade:
  //      cliente pode não saber o CEP, o CEP pode estar fora da base do
  //      ViaCEP, a internet pode estar lenta — nenhum desses casos pode
  //      travar a venda. Endereço, número, bairro, cidade e UF (o campo do
  //      bug real) são exigidos.
  //   3. A validação vale AQUI, no servidor — a tela (views/pdv.ejs) é só
  //      conveniência; quem contorna a tela ainda bate nesta recusa.
  if (!payload.clienteZohoId) {
    const faltando = [];
    if (!String(payload.endereco || '').trim()) faltando.push('endereço');
    if (!String(payload.numero || '').trim()) faltando.push('número');
    if (!String(payload.bairro || '').trim()) faltando.push('bairro');
    if (!String(payload.cidade || '').trim()) faltando.push('cidade');
    if (!String(payload.uf || '').trim()) faltando.push('UF');
    if (faltando.length) {
      return {
        ok: false, etapa: 'validacao-endereco',
        erro: `endereço obrigatório para cliente novo — falta: ${faltando.join(', ')}`,
      };
    }
  }

  // === ENTREGA EM OUTRO ENDEREÇO (pedido do dono, 24/ago/2026) ===
  // O balcão vende pra quem leva na hora, mas também pra quem pede entrega
  // em obra, condomínio ou outro imóvel — endereço que NÃO é o do cadastro
  // do cliente e que NUNCA pode sobrescrever o cadastro (mesma regra das
  // divergências de endereço, mais abaixo: cadastro antigo não se corrompe
  // por causa de uma venda).
  //
  // Quando o operador marca "entregar em outro endereço", o endereço de
  // entrega passa a ser exigido POR INTEIRO — aqui, no servidor, como todo
  // o resto (a tela é conveniência). CEP fica de fora pelo mesmo motivo do
  // endereço do cliente: cliente pode não saber, ViaCEP pode estar fora.
  //
  // Sem a marcação, nada muda: `entrega` some do payload do Omie e o pedido
  // sai idêntico ao de antes.
  // Nome do cliente. Sem ele a ficha do Omie nasce "Consumidor Final" e A NOTA
  // FISCAL SAI NESSE NOME. Pior: a busca por telefone reusa a ficha, então o
  // cliente fica genérico pra sempre — no CRM e no ERP. Medido 17/09: das 6
  // fichas criadas pelo PDV no Omie, as 2 sem CPF estão assim.
  //
  // `semIdentificar` é a saída explícita pra venda rápida de balcão: o
  // operador MARCA que não vai identificar, em vez de o rótulo entrar sozinho
  // porque o campo ficou em branco. A diferença é ele saber o que está fazendo.
  const nomeCliente = String(payload.clienteNome || '').trim();
  if (!nomeCliente && !payload.semIdentificar) {
    return {
      ok: false, etapa: 'validacao-cliente',
      erro: 'informe o nome do cliente — sem nome a nota fiscal sai como "Consumidor Final". ' +
            'Se for venda sem identificar, marque a opção na tela.',
    };
  }

  // Destino da venda — ver `resolveDestino` no rodapé deste arquivo.
  const destinoR = resolveDestino(payload);
  if (destinoR.erro) return { ok: false, etapa: 'validacao-destino', erro: destinoR.erro };
  const destino = destinoR.destino;

  const entregaPedida = !!(payload.entrega && payload.entrega.usar);
  if (entregaPedida) {
    const e = payload.entrega || {};
    const faltandoEntrega = [];
    if (!String(e.endereco || '').trim()) faltandoEntrega.push('endereço');
    if (!String(e.numero || '').trim()) faltandoEntrega.push('número');
    if (!String(e.bairro || '').trim()) faltandoEntrega.push('bairro');
    if (!String(e.cidade || '').trim()) faltandoEntrega.push('cidade');
    if (!String(e.uf || '').trim()) faltandoEntrega.push('UF');
    if (faltandoEntrega.length) {
      return {
        ok: false, etapa: 'validacao-entrega',
        erro: `endereço de entrega obrigatório — falta: ${faltandoEntrega.join(', ')}. ` +
              `Desmarque "entregar em outro endereço" se a entrega é no endereço do cadastro.`,
      };
    }
  }

  // Item sem código de produto é item sem cadastro: chega no Omie com
  // `codigo_produto_integracao` vazio e SEM NCM. Foi por aí que pedidos reais
  // desta empresa saíram com NCM 9403.30.00 (móvel de madeira) numa venda de
  // filtro — erro fiscal, com a nota já emitida. A recusa mora AQUI, no
  // servidor, e é ela que vale: a tela também bloqueia, mas tela se contorna
  // (console do navegador, requisição direta ao endpoint); o servidor não.
  const semCodigo = itens.filter(it => !String(it.codigo == null ? '' : it.codigo).trim());
  if (semCodigo.length) {
    const nomes = semCodigo.map(it => String(it.nome || 'sem nome').trim()).join(', ');
    return { ok: false, etapa: 'validacao-item', erro: `produto sem código de cadastro (${nomes}) — busque o produto no cadastro, que é de onde vêm o código e o NCM da nota. Item digitado à mão não pode virar nota fiscal.` };
  }

  const bruto = itens.reduce((s, it) => s + Number(it.valor) * Number(it.qtd || 1), 0);
  const desconto = Number(payload.desconto || 0);
  // Desconto negativo INFLA o valor (bruto 200 com desconto -50 vira 250) e o
  // valor inflado vai assim pro Omie e pra auditoria; desconto não-numérico
  // ('abc') vira NaN, que serializa como null no Negócio e entra como NaN na
  // coluna numérica do livro-razão. Os dois morrem aqui, antes de tudo.
  if (!Number.isFinite(desconto) || desconto < 0) {
    return { ok: false, etapa: 'validacao-desconto', erro: 'desconto inválido — use um número maior ou igual a zero' };
  }
  // Bruto zerado com desconto é desconto sobre nada — qualquer valor estoura o
  // teto do operador. Só o par (bruto 0, desconto 0) passa: é a cortesia/
  // brinde legítima, item de valor zero sem abatimento nenhum.
  //
  // TETO DO OPERADOR (5%): acima disso a venda só passa com autorização de
  // supervisor JÁ VERIFICADA (autorizacaoDesconto.ok === true) — a senha em
  // si nunca chega até aqui, só o resultado da checagem. Com autorização
  // válida NÃO HÁ TETO: qualquer desconto passa a partir daqui. `erro` de uma
  // tentativa de autorização que falhou (usuário não é autorizador, senha
  // errada) é repassado tal e qual — são as três mensagens distintas que o
  // operador precisa pra saber o que fazer.
  let descontoAutorizacao = null; // só preenchido quando a autorização foi de fato usada — vira registro de auditoria
  if (desconto > 0 && (bruto <= 0 || (desconto / bruto) * 100 > DESCONTO_MAX_PCT_OPERADOR)) {
    if (!autorizacaoDesconto || autorizacaoDesconto.ok !== true || !autorizacaoDesconto.autorizador) {
      const erro = (autorizacaoDesconto && autorizacaoDesconto.erro)
        || `desconto acima de ${DESCONTO_MAX_PCT_OPERADOR}% — precisa de autorização de um supervisor`;
      return { ok: false, etapa: 'autorizacao-desconto', erro };
    }
    // pct é SATURADO em 999.99: a coluna do livro-razão é NUMERIC(5,2) (só
    // 3 dígitos antes da vírgula) e, sem teto, o desconto pode ser MUITO
    // maior que o bruto (ex.: bruto de centavos, desconto de milhares) —
    // um percentual de bilhões estouraria a coluna e o INSERT falharia,
    // contradizendo "com autorização válida não há teto". O VALOR (R$) em
    // si, que é o que importa pro Omie e pro Negócio, nunca é tocado — só o
    // percentual exibido/auditado é limitado.
    const pctBruto = bruto > 0 ? Math.round((desconto / bruto) * 10000) / 100 : null;
    descontoAutorizacao = {
      autorizador: autorizacaoDesconto.autorizador,
      nomeAutorizador: autorizacaoDesconto.nomeAutorizador || autorizacaoDesconto.autorizador,
      pct: pctBruto != null ? Math.min(999.99, pctBruto) : null,
      valor: desconto,
    };
  }
  const totalProduto = Math.max(0, bruto - desconto);   // frete NÃO entra — bônus é sobre produto
  const empresa = payload.empresa;

  // O livro-razão é gravação local, mas pode falhar (idem ausente, Postgres
  // fora). O contrato de finalizarVenda é SEMPRE devolver {ok:false, erro} —
  // lançar daqui estouraria como 500 na tela, sem mensagem pro operador.
  // A senha do autorizador NUNCA pode ser gravada — nem logada. Se por algum
  // motivo `payload.autorizacao` ainda carrega `senha` (ex.: server.js
  // repassou o corpo cru pra rodar a verificação), o que vai pro livro-razão
  // — que grava o payload INTEIRO numa coluna JSONB — é uma cópia sem a
  // credencial: só o usuário digitado sobrevive. Sem `autorizacao.senha` no
  // payload original, `payloadParaGravar` é o MESMO objeto (sem cópia), pra
  // não quebrar quem depende de igualdade referencial do payload gravado.
  const payloadParaGravar = (payload && payload.autorizacao && ('senha' in payload.autorizacao))
    ? { ...payload, autorizacao: { usuario: payload.autorizacao.usuario } }
    : payload;

  let venda;
  try {
    venda = await ledger.abrir({
      idem: payload.idem, operador: who, empresa, total: totalProduto, payload: payloadParaGravar,
      // Autorização de desconto acima do teto — gravada JUNTO da venda, desde
      // a abertura, pra o dono poder auditar quem anda liberando desconto.
      // null nos três campos quando a venda não precisou de autorização.
      descontoAutorizadoPor: descontoAutorizacao ? descontoAutorizacao.autorizador : null,
      descontoPct: descontoAutorizacao ? descontoAutorizacao.pct : null,
      descontoValor: descontoAutorizacao ? descontoAutorizacao.valor : null,
    });
  } catch (e) {
    return { ok: false, etapa: 'livro-razao', erro: 'não foi possível registrar a venda: ' + e.message };
  }

  // ORDEM DAS DUAS GUARDAS — o retorno de venda completa vem PRIMEIRO, e isso é
  // deliberado. Uma linha 'completa' só pode ter nascido fora do modo sombra:
  // ela representa venda real, com nota emitida e Negócio confirmado por
  // releitura. Se a trava de sombra viesse antes, um reclique com a trava ligada
  // remarcaria essa linha como 'sombra' e apagaria o rastro de uma venda que
  // aconteceu de verdade. Antecipar o retorno não fura a trava: este caminho não
  // faz NENHUMA chamada externa — devolve e sai.
  if (!venda.novo && venda.estado === 'completa') {
    // Enriquece com a linha inteira do livro-razão: o operador que reenviou o
    // mesmo `idem` precisa ver QUAL pedido já fechou (número do Omie e do
    // Negócio no CRM), não só um "repetida:true" sem número nenhum — é essa
    // falta de número que faz a tela cair no caminho de cupom (que quebra sem
    // `cupom`) e o operador refazer a venda. Falha nesta leitura extra é só
    // enriquecimento: não pode derrubar o retorno idempotente que a trava
    // inteira existe pra garantir.
    let linha = null;
    try { linha = await ledger.buscar({ id: venda.id }); }
    catch (e) { console.warn('[pdv repetida] falha ao ler linha completa:', e.message); }
    return {
      ok: true, vendaId: venda.id,
      estado: (linha && linha.estado) || venda.estado,
      repetida: true,
      pedidoOmie: linha ? linha.omie_pedido : undefined,
      dealId: linha ? linha.zoho_deal_id : undefined,
    };
  }

  // === TRAVA DE MODO SOMBRA — antes de QUALQUER chamada externa, sem exceção ===
  // Verificada aqui: já validamos (itens, telefone, desconto) e já abrimos o
  // registro no livro-razão (gravação local, não é chamada externa). Dali em
  // diante NADA de omie-pdv nem de zoho pode ser tocado.
  //
  // DECISÃO EXPLÍCITA: em modo sombra NÃO se grava em pagamentos.audit(). Aquele
  // log é o registro financeiro de vendas que aconteceram de verdade; uma venda
  // sombra não emitiu nota, não movimentou dinheiro e não existe no ERP.
  // Registrá-la ali contaminaria a auditoria financeira com receita fantasma.
  // O rastro da venda sombra vive no livro-razão, com estado 'sombra'.
  if (process.env.TDF_PDV_MODO_SOMBRA === '1') {
    await ledger.marcar(venda.id, 'sombra', {});
    return { ok: true, vendaId: venda.id, estado: 'sombra' };
  }

  // === OMIE (nasce o pedido — a nota fica pra Eloize, manual, depois) ===
  let pedido;
  let avisoNotaFiscal = null; // cDescStatus do Omie, verbatim — nunca reescrito/resumido
  // Divergências de endereço/telefone de um cliente EXISTENTE: campo que já
  // tinha valor no Omie e o operador digitou outro no balcão. omie-pdv.js
  // NUNCA sobrescreve nesse caso — só devolve a lista aqui, pra virar uma
  // linha na observação da venda (Description do Negócio) em vez de sumir.
  let divergenciasEndereco = [];
  try {
    const cli = await opdv.garanteCliente(empresa, {
      nome: payload.clienteNome, cpf: payload.cpf, cnpj: payload.cnpj, telefone,
      // Telefone fixo é SEMPRE opcional — "às vezes ele tem um fixo" (pedido
      // do dono). Passa adiante o que veio, cru; omie-pdv.js decide se dá
      // pra separar DDD/número, e nunca bloqueia a venda se não der.
      telefoneFixo: payload.telefoneFixo,
      email: payload.email, endereco: payload.endereco, numero: payload.numero,
      complemento: payload.complemento,
      bairro: payload.bairro, cidade: payload.cidade, uf: payload.uf, cep: payload.cep,
    });
    if (Array.isArray(cli.divergenciasEndereco)) divergenciasEndereco = cli.divergenciasEndereco;
    pedido = await opdv.criaPedido(empresa, {
      idem: venda.id, codigoCliente: cli.codigo_cliente_omie,
      itens: itens.map(it => ({ codigo: it.codigo, descricao: it.nome, ncm: it.ncm,
                                qtd: it.qtd, valor: it.valor })),
      desconto,
      // Só viaja quando o operador de fato marcou a entrega alternativa —
      // `undefined` faz omie-pdv.js nem montar o bloco `outros_detalhes`.
      entrega: entregaPedida ? payload.entrega : undefined,
    });
    await ledger.marcar(venda.id, 'omie_ok',
      { omie_pedido: pedido.numero_pedido, omie_cliente: String(cli.codigo_cliente_omie) });

    // === VALIDAÇÃO DA NOTA — avisa o operador, NUNCA derruba a venda ===
    // Decisão do dono (19/ago/2026): o PDV não fatura mais — o pedido nasce
    // na etapa "10" e fica esperando faturamento humano (a Eloize, no
    // próprio Omie). ValidarPedidoVenda não decide mais se a venda passa:
    // ela avisa, com o cliente AINDA na frente do operador, do que falta
    // pra Eloize conseguir emitir a nota depois — sem isso ela só descobre
    // o problema com o cliente longe e o telefone tocando. A mensagem
    // (cDescStatus) é repassada verbatim, sem reescrever nem resumir.
    //
    // Try PRÓPRIO: uma falha na CHAMADA de validação (rede, Omie fora) não
    // pode derrubar a venda — o pedido já existe, a venda já aconteceu; só
    // o aviso fica ausente, igual a qualquer outra falha de enriquecimento
    // deste arquivo (ver _resolveClienteZoho mais abaixo, mesmo padrão).
    try {
      const validacao = await opdv.validarPedido(empresa, pedido.codigo_pedido);
      if (validacao && !validacao.ok) {
        avisoNotaFiscal = validacao.descStatus;
        await ledger.marcar(venda.id, 'nf_pendente', { erro: validacao.descStatus });
      }
    } catch (e) {
      console.warn('[pdv validacao nf]', e.message);
    }
  } catch (e) {
    await ledger.marcar(venda.id, 'falhou', { erro: e.message });
    const falha = { ok: false, vendaId: venda.id, estado: 'falhou', etapa: 'omie', erro: e.message };
    // Se o pedido já nasceu no Omie (falha só depois), o operador PRECISA
    // ver o número: sem ele a tela diz apenas "falhou", ele refaz a venda do
    // zero e o ERP fica com pedido duplicado. Isso já funcionava em
    // produção antes desta mudança — não regride.
    if (pedido && pedido.numero_pedido) falha.pedidoOmie = pedido.numero_pedido;
    return falha;
  }

  // === ZOHO (o cliente já foi embora; falha aqui não derruba a venda) ===
  let dealId = null, quoteId = null, contatoId = null, erroZoho = null;
  // Base pra quando o Zoho falhar (catch abaixo) ou não confirmar: 'nf_pendente'
  // quando a validação avisou de algo faltando pra nota (o dono do reconciliador
  // precisa ver isso), senão 'omie_ok' — igual ao comportamento de antes desta
  // mudança, só que a nota nunca mais faz parte do critério (ela não é mais
  // responsabilidade do PDV; ver 'completa' mais abaixo, que já não depende dela).
  let estado = avisoNotaFiscal ? 'nf_pendente' : 'omie_ok';
  try {
    // O Contato vem PRIMEIRO: é ele que o Negócio referencia. Falha aqui não
    // pode abortar o Negócio — um Negócio sem Contato ainda é melhor que
    // nenhum registro no CRM —, então tem catch próprio; o erro fica visível
    // e a venda NÃO chega a 'completa' (a checagem final exige o Contato).
    let contaZohoId = null;
    try {
      const alvo = await _resolveClienteZoho(payload, telefone);
      contatoId = alvo.contatoId;
      contaZohoId = alvo.contaId;
    } catch (e) {
      erroZoho = 'contato: ' + e.message;
      console.warn('[pdv contato]', e.message);
    }

    const deal = {
      Deal_Name: `Balcão — ${payload.clienteNome || 'Consumidor Final'}`,
      Stage: 'Fechado Ganho',
      Amount: totalProduto,
      Closing_Date: new Date().toISOString().slice(0, 10),
      Lead_Source: 'Visita na loja',
      Empresa_da_venda: empresa,
      Pedido_Omie: String(pedido.numero_pedido),
      Foi_enviado_para_o_Omie: 'Sim',
      Autor_Lead_Vendedor: who,
      Telefone_contato: telefone,
      // Endereço COMPLETO. Antes ia só a cidade — o endereço existia no
      // Contato e no Omie, mas o card do negócio nascia sem ele, e quem abre o
      // card não tinha pra onde entregar. Campos conferidos nos metadados.
      // ⚠️ `N_mero` em Negócios é INTEGER: "84A" viraria NaN, então só entra
      // quando é número puro; o resto fica no complemento, que é texto.
      ...montaEnderecoDeal(payload),
      // (complemento vai pro Description logo abaixo — não há campo próprio)
      Layout: { id: LAYOUT_LOJA_ID },
      Pipeline: PIPELINE_BALCAO,
      // Ver a nota sobre o picklist mentiroso na validação, acima.
      Envio: destinoR.tipoVenda,
    };
    if (destino === 'instalacao') {
      deal.Observa_es_da_Instala_o = String(payload.obsInstalacao).trim();
    }
    // Retirada = o cliente saiu com o produto na mão. Nasce ENTREGUE, com a
    // data de hoje: não há nada pendente e ninguém precisa marcar depois.
    // Medido 31/08: das 50 vendas "Retirada na Loja", 44 não viraram registro
    // em módulo nenhum — some da operação. O `Produto Entregue` é o que faz
    // essa venda parar de sumir.
    // Instalação e envio nascem FALSE de propósito: o produto ainda vai sair.
    Object.assign(deal, marcaEntrega(destino));
    if (destino === 'envio') {
      deal.Transportadora = String(payload.transportadora).trim();
      // "3.500,00" e "3500.00" chegam os dois do balcão; o CRM quer número.
      const frete = parseFrete(payload.valorFrete);
      if (frete != null) deal.Valor_do_Frete = frete;
    }
    if (OWNER_MARKETING_ID) deal.Owner = { id: OWNER_MARKETING_ID };
    // Contact_Name só recebe id de CONTATO — nunca o id cru que veio da tela.
    if (contatoId) deal.Contact_Name = { id: contatoId };
    // Empresa escolhida na busca vai no lookup DELA (módulo Accounts).
    if (contaZohoId) deal.Account_Name = { id: contaZohoId };
    // Canal_Normalizado e Origem_Normalizada NÃO existem no módulo Negócios
    // desta org (conferido nos metadados do CRM) — gravar neles faz o
    // createDeal voltar INVALID_DATA, cai no catch e a venda inteira some do
    // CRM (mesma armadilha do campo `CPF`). A resposta do "como conheceu a
    // gente" não pode se perder — é pedido explícito do dono, é o que
    // descobre que campanha traz gente pra loja —, então vai pro Description
    // (textarea, existe, 32.000 chars) numa linha com rótulo fixo e buscável,
    // junto do canal do mapa ORIGEM_CANAL. Nunca sobrescreve Description que
    // já tenha conteúdo: acrescenta.
    const linhaCompl = linhaComplementoDeal(payload);
    if (linhaCompl) {
      deal.Description = deal.Description ? `${deal.Description}\n${linhaCompl}` : linhaCompl;
    }
    if (payload.origem) {
      const canal = ORIGEM_CANAL[payload.origem] || 'Não mapeado';
      const linhaOrigem = `Origem PDV: ${payload.origem} | Canal: ${canal}`;
      deal.Description = deal.Description
        ? `${deal.Description}\n${linhaOrigem}`
        : linhaOrigem;
    }

    // Autorização de desconto acima do teto do operador: o dono quer poder
    // auditar quem anda liberando desconto — mesmo padrão de linha fixa e
    // buscável que a origem usa acima, nunca sobrescreve Description
    // existente. Nunca leva a senha (só existe aqui `autorizador`/`nome`,
    // vindos de `autorizacaoDesconto`, já verificado — a senha nunca chegou
    // até esta função).
    if (descontoAutorizacao) {
      const pctTxt = descontoAutorizacao.pct != null ? `${descontoAutorizacao.pct}%` : 'bruto zerado';
      const linhaDesconto = `Desconto autorizado por: ${descontoAutorizacao.nomeAutorizador} (${descontoAutorizacao.autorizador}) | ${pctTxt} | R$ ${descontoAutorizacao.valor.toFixed(2)}`;
      deal.Description = deal.Description
        ? `${deal.Description}\n${linhaDesconto}`
        : linhaDesconto;
    }

    // Divergência de endereço/telefone de cliente EXISTENTE — o campo já
    // tinha valor no Omie e o operador digitou outro no balcão. Regra do
    // dono: um erro de digitação no balcão não pode corromper cadastro
    // antigo, então o Omie NUNCA foi sobrescrito (ver omie-pdv.js); o que o
    // operador digitou fica registrado aqui, na observação da venda, pra
    // alguém checar depois — nunca se perde.
    if (divergenciasEndereco.length) {
      const linhaDivergencia = `Divergência de cadastro no balcão (Omie mantido):\n${divergenciasEndereco.map(d => `- ${d}`).join('\n')}`;
      deal.Description = deal.Description
        ? `${deal.Description}\n${linhaDivergencia}`
        : linhaDivergencia;
    }

    // Entrega em outro endereço — precisa ficar VISÍVEL pra quem separa e
    // entrega, e o módulo Negócios desta org não tem campo de endereço de
    // entrega (conferido nos metadados: só os campos de endereço do cliente).
    // Criar campo novo aqui seria criar mais um campo que ninguém preenche;
    // então vai pro Description, no mesmo padrão de linha rotulada e
    // buscável que a origem e o desconto já usam — nunca sobrescreve o que
    // já está lá.
    if (entregaPedida) {
      const e = payload.entrega || {};
      const linha1 = [e.endereco, e.numero, e.complemento].filter(Boolean).join(', ');
      const linha2 = [e.bairro, e.cidade, e.uf].filter(Boolean).join(' - ');
      const partes = [`ENTREGAR EM OUTRO ENDEREÇO: ${linha1}`, linha2];
      if (e.cep) partes.push(`CEP ${e.cep}`);
      // Nome/documento de quem recebe: só quando o operador digitou
      // (entrega em nome de terceiro — síndico, portaria, obra).
      if (String(e.nome || '').trim()) partes.push(`Receber com: ${String(e.nome).trim()}`);
      if (String(e.referencia || '').trim()) partes.push(`Referência: ${String(e.referencia).trim()}`);
      const linhaEntrega = partes.filter(Boolean).join(' | ');
      deal.Description = deal.Description
        ? `${deal.Description}\n${linhaEntrega}`
        : linhaEntrega;
    }

    const rd = await zoho.createDeal(deal);
    dealId = rd.id;
    await ledger.marcar(venda.id, 'zoho_ok', { zoho_deal_id: dealId });

    // Resolve o id do Zoho de cada item ANTES de montar o orçamento.
    // Falha aqui não derruba a venda: o item entra sem linha no orçamento e o
    // erro fica visível — a venda já subiu pro Omie e o cliente já foi embora.
    const itensComId = [];
    for (const it of itens) {
      if (it.id) { itensComId.push(it); continue; }
      try {
        const id = await zoho.garanteProdutoPorCodigo(it.codigo, it.nome, it.valor);
        if (id) itensComId.push({ ...it, id });
      } catch (e) {
        console.warn('[pdv produto zoho]', it.codigo, e.message);
      }
    }

    const quote = {
      Subject: `Balcão — ${payload.clienteNome || 'Consumidor Final'}`,
      Deal_Name: { id: dealId },
      // Product_Name é LOOKUP: resolve por ID, nunca por nome. Buscar produto
      // pelo nome depende de o texto bater caractere a caractere com o
      // cadastro — com dado sujo ele não resolve, a linha nasce sem produto (ou
      // o Orçamento inteiro é recusado) e a fila de troca de refil fica sem
      // saber o que o cliente comprou. O id do produto no Zoho já vem no
      // carrinho, de buscarProduto; ele viaja até aqui.
      // Item que veio do Omie não tem `id` do Zoho — o produto existe no ERP
      // mas nunca foi cadastrado no CRM. `garanteProdutoZoho` acha por código
      // ou cria na hora, e devolve o id. Sem isso a linha do Orçamento nasce
      // sem produto e a fila de troca de refil não sabe o que o cliente levou.
      Quoted_Items: itensComId.map(it => ({
        Product_Name: { id: it.id }, Quantity: Number(it.qtd),
        List_Price: Number(it.valor), Product_Code: it.codigo,
      })),
    };
    // Endereço no orçamento. O Zoho SÓ herda endereço do contato quando o
    // orçamento é criado pela TELA; criado por API ele grava exatamente o que
    // recebe — e não recebia nada, por isso a tela abria com tudo vazio.
    // Os campos abaixo são os que estão no layout Standard de Orçamentos
    // (conferido nos metadados): Rua, N_mero, Bairro, Cidade, Estado, CEP,
    // Complemento. Os Billing_*/Shipping_* padrão não estão na tela, mas vão
    // junto porque é deles que relatório e impressão do orçamento leem.
    Object.assign(quote, montaEnderecoQuote(payload));
    if (contatoId) quote.Contact_Name = { id: contatoId };
    const rq = await zoho.createQuote(quote);
    quoteId = rq.id;

    // Confirmação por LEITURA DE VOLTA — nunca pelo 200, e dos DOIS registros.
    // Negócio: os TRÊS campos relidos são conferidos — Stage (fechou),
    // Pedido_Omie (é ESTA venda) e Amount (bateu o líquido). Ler um campo e não
    // conferir seria deixar o CRM divergir do ERP em silêncio. Tolerância de 1
    // centavo porque o CRM devolve o número já arredondado a 2 casas.
    const lido = await zoho.getRecord('Deals', dealId, 'Stage,Amount,Pedido_Omie');
    const dealOk = !!lido && lido.Stage === 'Fechado Ganho' &&
                   String(lido.Pedido_Omie) === String(pedido.numero_pedido) &&
                   Number.isFinite(Number(lido.Amount)) &&
                   Math.abs(Number(lido.Amount) - totalProduto) < 0.01;

    // Orçamento: o id que o POST devolveu prova só que o Zoho respondeu — e ele
    // pode responder SUCCESS sem `details.id`. Relemos o Orçamento PELO ID e
    // conferimos as LINHAS: é a linha (Quoted_Items) que carrega o produto de
    // que a fila de manutenção depende pra chamar o cliente pra trocar o refil.
    // Um Orçamento sem linha nasce calado quando o lookup de produto não
    // resolve — e é exatamente o caso que o 200 esconderia.
    let quoteOk = false;
    if (quoteId) {
      const lidoQ = await zoho.getRecord('Quotes', quoteId, 'Subject,Quoted_Items');
      const linhas = (lidoQ && Array.isArray(lidoQ.Quoted_Items)) ? lidoQ.Quoted_Items : [];
      quoteOk = linhas.length > 0 && linhas.length === itens.length;
    }

    // Sem Contato não há pessoa no CRM, e sem pessoa o cliente nunca entra no
    // relógio de troca de refil: a venda fica pendente pro reconciliador, não
    // 'completa'.
    const ok = !!contatoId && quoteOk && dealOk;
    estado = ok ? 'completa' : 'zoho_ok';
    await ledger.marcar(venda.id, estado, { zoho_quote_id: quoteId });
  } catch (e) {
    erroZoho = e.message;
    await ledger.marcar(venda.id, estado, { erro: e.message });
  }

  pagamentos.audit({ tipo: 'pdv-venda', usuario: who, vendaId: venda.id, empresa,
    pedidoOmie: pedido.numero_pedido, dealId, quoteId, contatoId, estado, total: totalProduto,
    // Autorização de desconto: quem autorizou, percentual e valor — só entra
    // quando a venda de fato usou autorização de supervisor. NUNCA a senha.
    ...(descontoAutorizacao ? {
      descontoAutorizadoPor: descontoAutorizacao.autorizador,
      descontoPct: descontoAutorizacao.pct,
      descontoValor: descontoAutorizacao.valor,
    } : {}) });

  return { ok: true, vendaId: venda.id, estado, pedidoOmie: pedido.numero_pedido,
           avisoNotaFiscal, dealId, quoteId, contatoId, erro: erroZoho,
           cupom: { itens, bruto, desconto, frete: Number(payload.frete || 0),
                    total: totalProduto, cliente: payload.clienteNome || 'Consumidor Final',
                    data: new Date().toISOString(), formaPagamento: payload.formaPagamento || '—' } };
}

// ── Destino da venda: instalar, enviar ou levar na hora ─────────────────────
// Sem isto a venda de balcão não vira nada depois: não aparece na fila de quem
// instala (Pós Venda) nem na de quem despacha (Envio).
//
// 🚨 O campo do CRM é `Envio` (rótulo "Tipo de Venda") e os metadados MENTEM:
// o picklist declara actual='Sim'/'Não', mas o que está gravado nas 200 vendas
// ganhas e o que o filtro aceita são os RÓTULOS. Medido em 31/08/2026:
// (Envio:equals:Sim) devolve 0 registros; (Envio:equals:Instalação) devolve.
// Por isso gravamos 'Instalação'/'Envio' — nunca 'Não'/'Sim'.
const DESTINO_TIPO_VENDA = {
  instalacao: 'Instalação',
  envio: 'Envio',
  retirada: 'Retirada na Loja',
};

// Valor desconhecido cai em `retirada` de propósito: é o caso comum do balcão e
// o único que não exige nada. Um destino inválido nunca pode barrar a venda.
function resolveDestino(payload = {}) {
  const bruto = String(payload.destino || '').trim();
  const destino = DESTINO_TIPO_VENDA[bruto] ? bruto : 'retirada';
  if (destino === 'instalacao' && !String(payload.obsInstalacao || '').trim()) {
    return { destino, erro: 'escreva a observação para o Pós-Venda — é o que o técnico lê antes de agendar.' };
  }
  if (destino === 'envio' && !String(payload.transportadora || '').trim()) {
    return { destino, erro: 'informe a transportadora — sem ela ninguém sabe quem coleta o produto.' };
  }
  return { destino, tipoVenda: DESTINO_TIPO_VENDA[destino], erro: null };
}

// "3.500,00", "3500.00", "R$ 120" — tudo isso chega do balcão. O CRM quer
// número. Devolve null quando não dá pra ler ou quando é zero/negativo: frete
// zerado não é informação, e gravar 0 mente pra quem lê o card depois.
function parseFrete(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : null;
  let t = String(v).replace(/[^\d,.-]/g, '');
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// O que a venda grava sobre entrega. Retirada sai entregue na hora; os outros
// dois destinos ainda vão sair da loja, então nascem `false` — e é esse false
// que faz a venda aparecer como pendente pra quem despacha ou instala.
// `hoje` entra por parâmetro pra poder testar sem depender do relógio.
function marcaEntrega(destino, hoje = new Date().toISOString().slice(0, 10)) {
  return destino === 'retirada'
    ? { Produto_Entregue: true, Data_da_Entrega: hoje }
    : { Produto_Entregue: false };
}

// Um produto do Zoho vira item da lista do balcão. `vendavel: false` quando não
// tem código: sem código o Omie recebe o item SEM NCM e a nota sai com
// classificação fiscal errada (já saiu nota com NCM de móvel de madeira numa
// venda de filtro). O produto continua na lista, riscado — some da lista seria
// pior: a tela dizia "nenhum produto com esse nome" quando havia.
function marcaVendavel(p = {}) {
  return {
    id: p.id,
    codigo: p.Product_Code || '',
    vendavel: !!String(p.Product_Code || '').trim(),
    nome: p.Product_Name || '—',
    preco: Number(p.Unit_Price || 0),
    estoque: Number(p.Qty_in_Stock || 0),
    descricao: p.Description || '',
  };
}

// Só dígitos vira número; "84A", "s/n" ou vazio devolvem null. `N_mero` é
// INTEGER em Negócios — mandar texto faz o Zoho recusar o registro inteiro, e
// a venda some do CRM (mesma armadilha do campo `CPF`).
function numeroInteiro(v) {
  const t = String(v == null ? '' : v).trim();
  return /^\d{1,9}$/.test(t) ? Number(t) : null;
}

// Endereço do balcão -> campos do NEGÓCIO. Só devolve o que tem valor: campo
// vazio no payload não pode apagar o que já existe no card.
function montaEnderecoDeal(p = {}) {
  const out = {};
  if (p.endereco) out.Endere_o = String(p.endereco).trim();
  if (p.bairro) out.Bairro = String(p.bairro).trim();
  if (p.cidade) out.Cidade = String(p.cidade).trim();
  if (p.uf) out.Estado = String(p.uf).trim().toUpperCase();
  if (p.cep) out.CEP = String(p.cep).trim();
  const n = numeroInteiro(p.numero);
  if (n != null) out.N_mero = n;
  return out;
}

// 🚨 O módulo Negócios NÃO TEM campo `Complemento` (conferido nos metadados) e
// o Zoho aceita escrita em campo inexistente devolvendo SUCCESS — o dado
// simplesmente some. Complemento e número não-numérico ("84A", "s/n") viram
// uma linha rotulada no Description, mesmo padrão que origem, desconto e
// entrega já usam neste arquivo. Devolve '' quando não há o que dizer.
function linhaComplementoDeal(p = {}) {
  const n = numeroInteiro(p.numero);
  const partes = [
    n == null && p.numero ? `nº ${String(p.numero).trim()}` : '',
    p.complemento ? String(p.complemento).trim() : '',
  ].filter(Boolean);
  return partes.length ? `Complemento do endereço: ${partes.join(' · ')}` : '';
}

// Endereço do balcão -> campos do ORÇAMENTO. Preenche os campos da tela E os
// Billing_*/Shipping_* padrão, que são os que a impressão do orçamento usa.
function montaEnderecoQuote(p = {}) {
  const rua = String(p.endereco || '').trim();
  const cidade = String(p.cidade || '').trim();
  const uf = String(p.uf || '').trim().toUpperCase();
  const cep = String(p.cep || '').trim();
  // 🚨 SÓ os campos que estão no LAYOUT do orçamento. Campo fora do layout o
  // Zoho aceita, responde SUCCESS e NÃO GRAVA. Medido 02/09 no canário: dos 8
  // Billing_*/Shipping_* enviados, só `Shipping_Code` gravou — e é justamente
  // o único que está no layout Standard. Mandar o resto é ilusão de que o dado
  // foi salvo.
  const out = {};
  if (rua) out.Rua = rua;
  if (cidade) out.Cidade = cidade;
  if (uf) out.Estado = uf;
  if (cep) { out.CEP = cep; out.Shipping_Code = cep; }
  if (p.bairro) out.Bairro = String(p.bairro).trim();
  if (p.complemento) out.Complemento = String(p.complemento).trim();
  const n = numeroInteiro(p.numero);
  if (n != null) out.N_mero = n;
  return out;
}

// Rótulos genéricos que o balcão cria quando o operador não digita o nome.
// Contato assim PODE ser renomeado numa venda futura que traga nome de verdade.
const NOMES_GENERICOS = new Set(['consumidor final', 'consumidor', 'balcao', 'balcão']);

function ehNomeGenerico(c = {}) {
  const inteiro = [c.First_Name, c.Last_Name].filter(Boolean).join(' ').trim().toLowerCase();
  const so = String(c.Last_Name || '').trim().toLowerCase();
  return NOMES_GENERICOS.has(inteiro) || NOMES_GENERICOS.has(so);
}

// Nome do balcão -> First_Name/Last_Name do Contato.
// `Last_Name` é o único obrigatório do módulo. Nome de uma palavra vai INTEIRO
// pro Last_Name (First_Name fica fora) — nunca um sobrenome vazio, que é o que
// gera o Last_Name="." da base importada. Sem nome nenhum vira "Consumidor
// Final" inteiro no Last_Name: quebrar em First="Consumidor"/Last="Final"
// cria uma pessoa de sobrenome "Final", que é sujeira.
function nomeParaContato(nome) {
  const t = String(nome || '').trim();
  if (!t) return { Last_Name: 'Consumidor Final' };
  const partes = t.split(/\s+/);
  return partes.length > 1
    ? { First_Name: partes[0], Last_Name: partes.slice(1).join(' ') }
    : { Last_Name: t };
}

module.exports = { mesclaProdutos, linhaComplementoDeal, ehNomeGenerico, nomeParaContato, montaEnderecoDeal, montaEnderecoQuote, numeroInteiro, PIPELINE_BALCAO, marcaVendavel, marcaEntrega, resolveDestino, parseFrete, buscarContato, buscarProduto, finalizarVenda, DESCONTO_MAX_PCT_OPERADOR };
