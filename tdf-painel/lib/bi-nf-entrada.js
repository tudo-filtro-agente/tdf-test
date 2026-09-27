// lib/bi-nf-entrada.js — Entrada de NF-e (cabeçalho + itens + processamento)
//
// Fluxo:
// 1. ingest(xmlContent, origem): parseia XML, salva como 'pendente' em bi_nf_entrada
//    + bi_nf_item. Faz match automático de empresa (por CNPJ destinatário),
//    fornecedor (por CNPJ emitente — cria se não existir) e produtos (por SKU
//    ou nome similar). Não dá entrada no estoque ainda.
// 2. listAll/get: leitura
// 3. atualizarItem: ajusta matching de produto manual antes de processar
// 4. processar(id, { estoqueDestinoId, gerarContaPagar, prazoPagamento }):
//    - Cria movimentações tipo 'compra-recebida' pra cada item com produto_id
//    - Opcionalmente cria pagamento em rascunho (com parcelas se XML traz)
//    - Marca NF como 'processada'

const db = require('./bi-estoque-db');
const { parseNFeXml } = require('./bi-nf-parser');
const biEstoque = require('./bi-estoque');
const biFornecedores = require('./bi-fornecedores');
const biPagamentos = require('./bi-pagamentos');

function _pool() { return db.getPool(); }
const uid = (p='nf_') => p + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

async function ensureTable() {
  const pool = _pool();
  if (!pool) return;
  const sqls = [
    `CREATE TABLE IF NOT EXISTS bi_nf_entrada (
      id TEXT PRIMARY KEY,
      origem TEXT NOT NULL DEFAULT 'upload',   -- 'imap' | 'upload'
      email_uid TEXT,
      email_from TEXT,
      email_subject TEXT,
      email_received_at TIMESTAMPTZ,
      xml_filename TEXT,
      xml_content TEXT,                         -- raw pra reprocessar/auditar
      nfe_chave TEXT UNIQUE NOT NULL,
      nfe_numero TEXT, nfe_serie TEXT,
      nfe_natureza TEXT,
      nfe_data_emissao DATE,
      nfe_valor_total NUMERIC(14,2),
      emitente_cnpj TEXT, emitente_razao TEXT, emitente_uf TEXT,
      destinatario_cnpj TEXT, destinatario_razao TEXT,
      empresa_id TEXT REFERENCES bi_empresas(id) ON DELETE SET NULL,
      fornecedor_id TEXT REFERENCES bi_fornecedores(id) ON DELETE SET NULL,
      pagamento_id TEXT,                        -- id do pagamento criado (storage JSON, sem FK)
      parcelas_json JSONB,                      -- snapshot pra reprocessar
      status TEXT NOT NULL DEFAULT 'pendente',  -- pendente | processada | descartada | erro
      observacoes TEXT,
      erro TEXT,
      processada_em TIMESTAMPTZ,
      processada_por TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS idx_nfe_status ON bi_nf_entrada (status)`,
    `CREATE INDEX IF NOT EXISTS idx_nfe_emitente ON bi_nf_entrada (emitente_cnpj)`,
    `CREATE INDEX IF NOT EXISTS idx_nfe_data ON bi_nf_entrada (nfe_data_emissao)`,

    `CREATE TABLE IF NOT EXISTS bi_nf_item (
      id TEXT PRIMARY KEY,
      nf_id TEXT NOT NULL REFERENCES bi_nf_entrada(id) ON DELETE CASCADE,
      ordem INT NOT NULL,
      cprod TEXT, xprod TEXT, ncm TEXT, cfop TEXT,
      ucom TEXT,
      qcom NUMERIC(14,4) NOT NULL,
      vunit NUMERIC(14,4) NOT NULL,
      vprod NUMERIC(14,2) NOT NULL,
      icms_valor NUMERIC(14,2) DEFAULT 0,
      icms_aliq NUMERIC(7,2) DEFAULT 0,
      produto_id TEXT REFERENCES bi_produtos(id) ON DELETE SET NULL,
      match_tipo TEXT,                          -- 'sku' | 'nome' | 'manual' | 'novo' | null
      match_score NUMERIC(4,3),                 -- 0..1 (qualidade do match automático)
      ignorar BOOLEAN DEFAULT FALSE,            -- se TRUE, item não entra no estoque
      observacoes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS idx_nfi_nf ON bi_nf_item (nf_id)`,
  ];
  for (const sql of sqls) {
    try { await pool.query(sql); }
    catch(e) { console.error('[bi-nf-entrada ensure]', e.message); throw e; }
  }
  console.log('[bi-nf-entrada] tabelas criadas/verificadas');
}

function _norm(s) {
  return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').trim();
}

// Match automático de produto: tenta SKU exato, depois nome similar (Postgres ILIKE)
async function _matchProduto(item) {
  const pool = _pool(); if (!pool) return null;
  // 1) SKU exato (cProd === sku)
  if (item.cProd) {
    const r = await pool.query('SELECT id, nome, sku, custo_medio FROM bi_produtos WHERE sku = $1 LIMIT 1', [item.cProd]);
    if (r.rows[0]) return { produto: r.rows[0], match_tipo: 'sku', match_score: 1.0 };
  }
  // 2) Nome ILIKE (substring) — tenta primeiras 3 palavras significativas
  const nomeBusca = _norm(item.xProd).split(/\s+/).filter(w => w.length > 2).slice(0,3).join(' ');
  if (nomeBusca) {
    const r = await pool.query(
      'SELECT id, nome, sku, custo_medio FROM bi_produtos WHERE lower(nome) ILIKE $1 ORDER BY length(nome) ASC LIMIT 1',
      ['%' + nomeBusca + '%']
    );
    if (r.rows[0]) return { produto: r.rows[0], match_tipo: 'nome', match_score: 0.7 };
  }
  return null;
}

// Match de fornecedor por CNPJ — se não existir, cria automaticamente
async function _matchOrCreateFornecedor(emitente, who) {
  if (!emitente.cnpj) return null;
  // Já existe?
  const existing = await biFornecedores.listAll({ search: emitente.cnpj });
  const matched = existing.find(f => (f.doc||'').replace(/\D/g,'') === emitente.cnpj);
  if (matched) return matched;
  // Cria com dados do XML
  try {
    return await biFornecedores.upsert({
      nome: emitente.razaoSocial || emitente.cnpj,
      doc: emitente.cnpj,
      docTipo: emitente.cnpj.length === 14 ? 'cnpj' : 'cpf',
      telefone: emitente.telefone || '',
      endereco: [emitente.logradouro, emitente.numero, emitente.bairro].filter(Boolean).join(', '),
      cidade: emitente.municipio || '',
      uf: emitente.uf || '',
      cep: emitente.cep || '',
      observacoes: 'Criado automaticamente via importação NF-e',
    }, who || 'nf-import');
  } catch(e) {
    console.warn('[bi-nf-entrada] auto-create fornecedor falhou:', e.message);
    return null;
  }
}

// Match de empresa por CNPJ do destinatário
async function _matchEmpresa(destinatarioCnpj) {
  const pool = _pool(); if (!pool || !destinatarioCnpj) return null;
  // Bate só por dígitos
  const r = await pool.query(
    "SELECT id, nome, cnpj FROM bi_empresas WHERE regexp_replace(coalesce(cnpj,''), '\\D', '', 'g') = $1 LIMIT 1",
    [destinatarioCnpj]
  );
  return r.rows[0] || null;
}

// Ingere XML: salva, faz matches automáticos, retorna NF com items
async function ingest(xmlContent, opts = {}, who = null) {
  const pool = _pool();
  if (!pool) throw new Error('Postgres não conectado');

  let parsed;
  try { parsed = parseNFeXml(xmlContent); }
  catch(e) {
    throw new Error('parser falhou: ' + e.message);
  }

  // Já existe NF com essa chave?
  const ja = await pool.query('SELECT id, status FROM bi_nf_entrada WHERE nfe_chave = $1', [parsed.chave]);
  if (ja.rows[0]) {
    return { ok:true, duplicada:true, id: ja.rows[0].id, status: ja.rows[0].status, chave: parsed.chave };
  }

  // Matches automáticos
  const empresa = await _matchEmpresa(parsed.destinatario.cnpj);
  const fornecedor = await _matchOrCreateFornecedor(parsed.emitente, who);

  const id = uid();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`INSERT INTO bi_nf_entrada
      (id, origem, email_uid, email_from, email_subject, email_received_at, xml_filename, xml_content,
       nfe_chave, nfe_numero, nfe_serie, nfe_natureza, nfe_data_emissao, nfe_valor_total,
       emitente_cnpj, emitente_razao, emitente_uf, destinatario_cnpj, destinatario_razao,
       empresa_id, fornecedor_id, parcelas_json, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,'pendente')`,
      [id, opts.origem || 'upload', opts.emailUid || null, opts.emailFrom || null, opts.emailSubject || null,
       opts.emailReceivedAt || null, opts.xmlFilename || null, xmlContent,
       parsed.chave, parsed.numero, parsed.serie, parsed.naturezaOperacao, parsed.dataEmissao, parsed.valores.vNF,
       parsed.emitente.cnpj, parsed.emitente.razaoSocial, parsed.emitente.uf,
       parsed.destinatario.cnpj, parsed.destinatario.razaoSocial,
       empresa?.id || null, fornecedor?.id || null,
       JSON.stringify(parsed.parcelas || [])]);

    // Itens
    for (const it of parsed.itens) {
      const matchProd = await _matchProduto(it);
      await client.query(`INSERT INTO bi_nf_item
        (id, nf_id, ordem, cprod, xprod, ncm, cfop, ucom, qcom, vunit, vprod, icms_valor, icms_aliq,
         produto_id, match_tipo, match_score)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [uid('it_'), id, it.ordem, it.cProd, it.xProd, it.ncm, it.cfop, it.uCom, it.qCom, it.vUnCom, it.vProd,
         it.icmsValor, it.icmsAliq,
         matchProd?.produto?.id || null, matchProd?.match_tipo || null, matchProd?.match_score || null]);
    }

    await client.query('COMMIT');
    return { ok:true, duplicada:false, id, chave: parsed.chave, itens: parsed.itens.length,
             empresaMatch: !!empresa, fornecedorAuto: !!fornecedor };
  } catch(e) {
    await client.query('ROLLBACK');
    throw e;
  } finally { client.release(); }
}

async function listAll(opts = {}) {
  const pool = _pool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.status) { params.push(opts.status); conds.push(`n.status = $${params.length}`); }
  if (opts.dateFrom) { params.push(opts.dateFrom); conds.push(`n.nfe_data_emissao >= $${params.length}`); }
  if (opts.dateTo) { params.push(opts.dateTo); conds.push(`n.nfe_data_emissao <= $${params.length}`); }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`
    SELECT n.*, e.nome AS empresa_nome, f.nome AS fornecedor_nome,
      (SELECT COUNT(*) FROM bi_nf_item i WHERE i.nf_id = n.id) AS itens_total,
      (SELECT COUNT(*) FROM bi_nf_item i WHERE i.nf_id = n.id AND i.produto_id IS NOT NULL) AS itens_match
    FROM bi_nf_entrada n
    LEFT JOIN bi_empresas e ON e.id = n.empresa_id
    LEFT JOIN bi_fornecedores f ON f.id = n.fornecedor_id
    ${where}
    ORDER BY n.created_at DESC
    LIMIT 200
  `, params);
  return r.rows;
}

async function get(id) {
  const pool = _pool(); if (!pool) return null;
  const cab = await pool.query(`
    SELECT n.*, e.nome AS empresa_nome, f.nome AS fornecedor_nome, f.doc AS fornecedor_doc
    FROM bi_nf_entrada n
    LEFT JOIN bi_empresas e ON e.id = n.empresa_id
    LEFT JOIN bi_fornecedores f ON f.id = n.fornecedor_id
    WHERE n.id = $1
  `, [id]);
  if (!cab.rows[0]) return null;
  const itens = await pool.query(`
    SELECT i.*, p.nome AS produto_nome, p.sku AS produto_sku
    FROM bi_nf_item i
    LEFT JOIN bi_produtos p ON p.id = i.produto_id
    WHERE i.nf_id = $1
    ORDER BY i.ordem
  `, [id]);
  return { ...cab.rows[0], itens: itens.rows };
}

async function atualizarItem(itemId, patch, who) {
  const pool = _pool(); if (!pool) throw new Error('pool não inicializada');
  const set = []; const params = [];
  if (patch.produtoId !== undefined) { params.push(patch.produtoId || null); set.push(`produto_id = $${params.length}`); }
  if (patch.matchTipo !== undefined) { params.push(patch.matchTipo); set.push(`match_tipo = $${params.length}`); }
  if (patch.ignorar !== undefined) { params.push(!!patch.ignorar); set.push(`ignorar = $${params.length}`); }
  if (patch.observacoes !== undefined) { params.push(patch.observacoes); set.push(`observacoes = $${params.length}`); }
  if (!set.length) return null;
  params.push(itemId);
  await pool.query(`UPDATE bi_nf_item SET ${set.join(', ')} WHERE id = $${params.length}`, params);
  const r = await pool.query('SELECT * FROM bi_nf_item WHERE id = $1', [itemId]);
  return r.rows[0];
}

async function atualizarCabecalho(id, patch) {
  const pool = _pool(); if (!pool) throw new Error('pool não inicializada');
  const set = []; const params = [];
  if (patch.empresaId !== undefined) { params.push(patch.empresaId || null); set.push(`empresa_id = $${params.length}`); }
  if (patch.fornecedorId !== undefined) { params.push(patch.fornecedorId || null); set.push(`fornecedor_id = $${params.length}`); }
  if (patch.observacoes !== undefined) { params.push(patch.observacoes); set.push(`observacoes = $${params.length}`); }
  if (!set.length) return null;
  params.push(id);
  await pool.query(`UPDATE bi_nf_entrada SET ${set.join(', ')} WHERE id = $${params.length}`, params);
  return get(id);
}

// Processa a NF: cria movs estoque + (opcional) pagamento rascunho
async function processar(id, opts, who) {
  const pool = _pool();
  if (!pool) throw new Error('Postgres não conectado');
  const nf = await get(id);
  if (!nf) throw new Error('NF não encontrada');
  if (nf.status === 'processada') throw new Error('NF já processada');
  if (!opts.estoqueDestinoId) throw new Error('estoqueDestinoId obrigatório');
  const naoMatched = nf.itens.filter(i => !i.ignorar && !i.produto_id);
  if (naoMatched.length) throw new Error(`${naoMatched.length} item(ns) sem produto vinculado. Use "ignorar" ou vincule um produto antes de processar.`);

  const erros = [];
  const movsOk = [];
  for (const it of nf.itens) {
    if (it.ignorar) continue;
    if (!it.produto_id) continue;
    try {
      await biEstoque.movimentar({
        tipo: 'compra-recebida',
        produtoId: it.produto_id,
        estoqueDestinoId: opts.estoqueDestinoId,
        qtd: Number(it.qcom),
        custoUnit: Number(it.vunit),
        refTipo: 'nfe',
        refId: nf.id,
        obs: `NF ${nf.nfe_numero}/${nf.nfe_serie} item ${it.ordem}`,
        metadata: { chave: nf.nfe_chave, cProd: it.cprod, xProd: it.xprod },
      }, who || 'nf-import');
      movsOk.push(it.id);
    } catch(e) {
      erros.push({ itemId: it.id, ordem: it.ordem, motivo: e.message });
    }
  }
  if (erros.length === nf.itens.filter(i => !i.ignorar).length) {
    // Todos falharam, não marca como processada
    throw new Error('Nenhum item entrou no estoque. Primeiro erro: ' + erros[0]?.motivo);
  }

  // Pagamento rascunho?
  let pagamentoId = null;
  if (opts.gerarContaPagar) {
    const parcelas = Array.isArray(nf.parcelas_json) ? nf.parcelas_json : (nf.parcelas_json ? JSON.parse(nf.parcelas_json) : []);
    const fornNome = nf.fornecedor_nome || nf.emitente_razao || nf.emitente_cnpj;
    if (parcelas && parcelas.length > 1) {
      // Cria UM pagamento por parcela
      const pags = [];
      for (const p of parcelas) {
        const pag = biPagamentos.criar({
          empresaBI: opts.empresaBI || '',
          fornecedor: fornNome,
          fornecedorId: nf.fornecedor_id || '',
          categoria: opts.categoria || 'mercadorias',
          descricao: `NF ${nf.nfe_numero}/${nf.nfe_serie} parcela ${p.numero} de ${parcelas.length}`,
          valor: Number(p.valor) || 0,
          vencimento: p.vencimento || nf.nfe_data_emissao,
          obs: `Importado da NF-e chave ${nf.nfe_chave}`,
        }, who || 'nf-import');
        pags.push(pag.id);
      }
      pagamentoId = pags.join(',');
    } else {
      // Pagamento único
      const venc = parcelas[0]?.vencimento || opts.prazoPagamento || nf.nfe_data_emissao;
      const pag = biPagamentos.criar({
        empresaBI: opts.empresaBI || '',
        fornecedor: fornNome,
        fornecedorId: nf.fornecedor_id || '',
        categoria: opts.categoria || 'mercadorias',
        descricao: `NF ${nf.nfe_numero}/${nf.nfe_serie}`,
        valor: Number(nf.nfe_valor_total) || 0,
        vencimento: venc,
        obs: `Importado da NF-e chave ${nf.nfe_chave}`,
      }, who || 'nf-import');
      pagamentoId = pag.id;
    }
  }

  await pool.query(`UPDATE bi_nf_entrada
    SET status='processada', processada_em=NOW(), processada_por=$2, pagamento_id=$3, observacoes=$4
    WHERE id=$1`,
    [id, who || null, pagamentoId, opts.observacoes || nf.observacoes || null]);

  return { ok:true, movs: movsOk.length, erros, pagamentoId };
}

async function descartar(id, motivo, who) {
  const pool = _pool(); if (!pool) throw new Error('pool não inicializada');
  await pool.query(`UPDATE bi_nf_entrada SET status='descartada', observacoes=$2, processada_por=$3, processada_em=NOW() WHERE id=$1`,
    [id, motivo || 'descartada manualmente', who || null]);
  return { ok:true };
}

module.exports = {
  ensureTable,
  ingest,
  listAll,
  get,
  atualizarItem,
  atualizarCabecalho,
  processar,
  descartar,
};
