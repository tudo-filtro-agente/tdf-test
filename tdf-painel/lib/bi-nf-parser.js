// lib/bi-nf-parser.js — Parser de NF-e (XML SEFAZ modelo 55)
//
// Aceita o XML completo (procNFe ou apenas NFe) e devolve estrutura normalizada
// usada no fluxo de entrada de estoque + contas a pagar.
//
// NÃO valida assinatura digital — só lê os campos necessários pra dar entrada
// no estoque e gerar conta a pagar.

const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  trimValues: true,
});

function _digits(v) { return String(v||'').replace(/\D/g,''); }
function _num(v) { if (v === undefined || v === null || v === '') return 0; const n = Number(String(v).replace(',','.')); return isNaN(n) ? 0 : n; }
function _arr(x) { return x === undefined || x === null ? [] : (Array.isArray(x) ? x : [x]); }

function parseNFeXml(xmlContent) {
  if (!xmlContent || typeof xmlContent !== 'string') throw new Error('XML vazio');
  // Remove BOM e qualquer lixo antes do <?xml
  const xml = xmlContent.replace(/^[^<]+/,'').trim();
  let doc;
  try { doc = parser.parse(xml); }
  catch(e) { throw new Error('XML inválido: ' + e.message); }

  // Pode vir como nfeProc > NFe > infNFe OU NFe > infNFe direto
  const root = doc.nfeProc || doc;
  const nfe = root.NFe || root.nfe;
  if (!nfe) throw new Error('elemento <NFe> não encontrado (não parece ser NF-e modelo 55)');
  const inf = nfe.infNFe || nfe.infnfe;
  if (!inf) throw new Error('elemento <infNFe> não encontrado');

  const chave = _digits(inf['@_Id'] || '').replace(/^NFe/,'');
  if (chave.length !== 44) throw new Error('chave NF-e inválida (esperado 44 dígitos, veio ' + chave.length + ')');

  const ide = inf.ide || {};
  const emit = inf.emit || {};
  const dest = inf.dest || {};
  const total = (inf.total && inf.total.ICMSTot) || {};
  const det = _arr(inf.det);
  const cobr = inf.cobr || {};
  const dup = _arr(cobr.dup);
  const pag = inf.pag || {};
  const detPag = _arr(pag.detPag);

  const emitenteEnd = emit.enderEmit || {};
  const destEnd = dest.enderDest || {};

  const itens = det.map((d, idx) => {
    const prod = d.prod || {};
    const imp = d.imposto || {};
    // ICMS pode vir em vários nodes (ICMS00, ICMS10, etc) — pega o primeiro
    let icmsValor = 0, icmsAliq = 0;
    if (imp.ICMS) {
      const icmsBlock = Object.values(imp.ICMS)[0] || {};
      icmsValor = _num(icmsBlock.vICMS);
      icmsAliq = _num(icmsBlock.pICMS);
    }
    return {
      ordem: idx + 1,
      cProd: String(prod.cProd || ''),
      xProd: String(prod.xProd || ''),
      ncm: String(prod.NCM || ''),
      cfop: String(prod.CFOP || ''),
      uCom: String(prod.uCom || prod.uTrib || 'UN'),
      qCom: _num(prod.qCom || prod.qTrib || 0),
      vUnCom: _num(prod.vUnCom || prod.vUnTrib || 0),
      vProd: _num(prod.vProd || 0),
      vDesc: _num(prod.vDesc || 0),
      vFrete: _num(prod.vFrete || 0),
      icmsValor,
      icmsAliq,
    };
  });

  return {
    chave,
    versao: String(inf['@_versao'] || ''),
    numero: String(ide.nNF || ''),
    serie: String(ide.serie || ''),
    dataEmissao: String(ide.dhEmi || ide.dEmi || '').slice(0,10) || null,
    naturezaOperacao: String(ide.natOp || ''),
    cfopHeader: String(det[0]?.prod?.CFOP || ''),
    finalidade: String(ide.finNFe || ''),
    emitente: {
      cnpj: _digits(emit.CNPJ || emit.CPF || ''),
      razaoSocial: String(emit.xNome || ''),
      nomeFantasia: String(emit.xFant || ''),
      ie: String(emit.IE || ''),
      logradouro: String(emitenteEnd.xLgr || ''),
      numero: String(emitenteEnd.nro || ''),
      bairro: String(emitenteEnd.xBairro || ''),
      municipio: String(emitenteEnd.xMun || ''),
      uf: String(emitenteEnd.UF || ''),
      cep: String(emitenteEnd.CEP || ''),
      telefone: String(emitenteEnd.fone || emit.fone || ''),
    },
    destinatario: {
      cnpj: _digits(dest.CNPJ || dest.CPF || ''),
      razaoSocial: String(dest.xNome || ''),
      ie: String(dest.IE || ''),
      municipio: String(destEnd.xMun || ''),
      uf: String(destEnd.UF || ''),
    },
    valores: {
      vBC: _num(total.vBC),
      vICMS: _num(total.vICMS),
      vProd: _num(total.vProd),
      vFrete: _num(total.vFrete),
      vSeg: _num(total.vSeg),
      vDesc: _num(total.vDesc),
      vIPI: _num(total.vIPI),
      vOutro: _num(total.vOutro),
      vNF: _num(total.vNF),
    },
    parcelas: dup.map((d,i) => ({
      numero: String(d.nDup || (i+1)),
      vencimento: String(d.dVenc || '').slice(0,10),
      valor: _num(d.vDup),
    })),
    pagamentos: detPag.map(p => ({
      tipo: String(p.tPag || ''),
      valor: _num(p.vPag),
    })),
    itens,
  };
}

module.exports = { parseNFeXml };
