// lib/bi-fornecedores.js — Cadastro de fornecedores (Postgres)
//
// Tabela bi_fornecedores: nome, doc (CPF/CNPJ), contato, telefone, email,
// categoria, chave PIX, dados bancários, endereço, ativo, observações.
//
// Reusa o pool do bi-estoque-db (que já hooka no pgInit). Ensure separado.

const db = require('./bi-estoque-db');

function _pool() { return db.getPool(); }

const uid = () => 'frn_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-3);

async function ensureTable() {
  const pool = _pool();
  if (!pool) return;
  const sqls = [
    `CREATE TABLE IF NOT EXISTS bi_fornecedores (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      doc TEXT,                          -- CPF/CNPJ apenas dígitos
      doc_tipo TEXT,                     -- 'cpf' | 'cnpj' | null
      categoria TEXT,
      contato_nome TEXT,
      telefone TEXT,
      whatsapp TEXT,
      email TEXT,
      chave_pix TEXT,
      tipo_chave_pix TEXT,               -- cpf|cnpj|email|telefone|aleatoria
      banco TEXT, agencia TEXT, conta TEXT, tipo_conta TEXT,
      site TEXT,
      endereco TEXT,
      cep TEXT, cidade TEXT, uf TEXT,
      observacoes TEXT,
      empresa_padrao_id TEXT REFERENCES bi_empresas(id) ON DELETE SET NULL,
      ativo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      updated_by TEXT
    )`,
    `CREATE INDEX IF NOT EXISTS idx_fornec_ativo ON bi_fornecedores (ativo)`,
    `CREATE INDEX IF NOT EXISTS idx_fornec_categoria ON bi_fornecedores (categoria)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_fornec_doc ON bi_fornecedores (doc) WHERE doc IS NOT NULL AND doc <> ''`,
    `CREATE INDEX IF NOT EXISTS idx_fornec_nome_lower ON bi_fornecedores (lower(nome))`,
  ];
  for (const sql of sqls) {
    try { await pool.query(sql); }
    catch(e) { console.error('[bi-fornecedores ensure]', e.message); throw e; }
  }
  console.log('[bi-fornecedores] tabela criada/verificada');
}

function _detectDocTipo(d) {
  const dig = String(d||'').replace(/\D/g,'');
  if (dig.length === 11) return 'cpf';
  if (dig.length === 14) return 'cnpj';
  return null;
}

async function listAll(opts = {}) {
  const pool = _pool(); if (!pool) return [];
  const conds = []; const params = [];
  if (opts.ativo !== undefined) { params.push(!!opts.ativo); conds.push(`ativo = $${params.length}`); }
  if (opts.categoria) { params.push(opts.categoria); conds.push(`categoria = $${params.length}`); }
  if (opts.search) {
    params.push('%' + opts.search.toLowerCase() + '%');
    conds.push(`(lower(nome) LIKE $${params.length} OR doc LIKE $${params.length} OR lower(email) LIKE $${params.length})`);
  }
  const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
  const r = await pool.query(`SELECT * FROM bi_fornecedores ${where} ORDER BY nome LIMIT 500`, params);
  return r.rows;
}

async function get(id) {
  const pool = _pool(); if (!pool) return null;
  const r = await pool.query('SELECT * FROM bi_fornecedores WHERE id = $1', [id]);
  return r.rows[0] || null;
}

// Busca por nome (substring) — pra autocomplete de pagamento
async function searchByNome(q) {
  const pool = _pool(); if (!pool || !q || q.length < 2) return [];
  const r = await pool.query(
    `SELECT id, nome, doc, doc_tipo, categoria, chave_pix, telefone FROM bi_fornecedores
     WHERE ativo = TRUE AND lower(nome) LIKE $1 ORDER BY nome LIMIT 20`,
    ['%' + q.toLowerCase() + '%']
  );
  return r.rows;
}

async function upsert(patch, who) {
  const pool = _pool(); if (!pool) throw new Error('Postgres não conectado');
  const nome = String(patch.nome||'').trim();
  if (!nome) throw new Error('nome obrigatório');
  const id = patch.id || uid();
  const cur = await get(id);
  const docDig = String(patch.doc||'').replace(/\D/g,'');
  const docTipo = patch.docTipo || _detectDocTipo(docDig);
  const cols = {
    nome,
    doc: docDig || null,
    doc_tipo: docTipo,
    categoria: patch.categoria || null,
    contato_nome: patch.contatoNome || null,
    telefone: String(patch.telefone||'').replace(/\D/g,'') || null,
    whatsapp: String(patch.whatsapp||'').replace(/\D/g,'') || null,
    email: patch.email || null,
    chave_pix: patch.chavePix || null,
    tipo_chave_pix: patch.tipoChavePix || null,
    banco: patch.banco || null,
    agencia: patch.agencia || null,
    conta: patch.conta || null,
    tipo_conta: patch.tipoConta || null,
    site: patch.site || null,
    endereco: patch.endereco || null,
    cep: patch.cep || null,
    cidade: patch.cidade || null,
    uf: patch.uf || null,
    observacoes: patch.observacoes || null,
    empresa_padrao_id: patch.empresaPadraoId || null,
    ativo: patch.ativo !== undefined ? !!patch.ativo : (cur?.ativo !== false),
  };
  if (cur) {
    const setSql = Object.keys(cols).map((k,i) => `${k} = $${i+2}`).join(', ');
    const params = [id, ...Object.values(cols)];
    await pool.query(`UPDATE bi_fornecedores SET ${setSql}, updated_at=NOW(), updated_by=$${params.length+1} WHERE id=$1`, [...params, who||null]);
  } else {
    const colNames = ['id', ...Object.keys(cols), 'updated_by'];
    const placeholders = colNames.map((_,i) => '$'+(i+1)).join(',');
    const params = [id, ...Object.values(cols), who || null];
    await pool.query(`INSERT INTO bi_fornecedores (${colNames.join(',')}) VALUES (${placeholders})`, params);
  }
  return get(id);
}

async function remove(id) {
  const pool = _pool(); if (!pool) return false;
  const r = await pool.query('DELETE FROM bi_fornecedores WHERE id = $1', [id]);
  return r.rowCount > 0;
}

// === Importação CSV ===
const HEADER_ALIASES = {
  nome: 'nome', razao_social: 'nome', fornecedor: 'nome',
  doc: 'doc', cnpj: 'doc', cpf: 'doc', documento: 'doc',
  categoria: 'categoria',
  contato: 'contatoNome', contato_nome: 'contatoNome',
  telefone: 'telefone', tel: 'telefone', fone: 'telefone',
  whatsapp: 'whatsapp', cel: 'whatsapp', celular: 'whatsapp',
  email: 'email', e_mail: 'email',
  chave_pix: 'chavePix', pix: 'chavePix',
  tipo_chave_pix: 'tipoChavePix', tipo_pix: 'tipoChavePix',
  banco: 'banco', agencia: 'agencia', conta: 'conta', tipo_conta: 'tipoConta',
  site: 'site',
  endereco: 'endereco', cep: 'cep', cidade: 'cidade', uf: 'uf', estado: 'uf',
  observacoes: 'observacoes', obs: 'observacoes',
};
function _norm(s) { return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9_]+/g,'_').replace(/^_|_$/g,''); }

async function importCsv(csvText, { dryRun = false, who = 'csv', mergeExistentes = true } = {}) {
  const lines = String(csvText||'').split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { dryRun, criados:[], atualizados:[], erros:[{linha:0, motivo:'CSV vazio'}], total:0 };
  const sep = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
  const rawHeaders = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,''));
  const headers = rawHeaders.map(_norm).map(h => HEADER_ALIASES[h] || h);

  const criados = []; const atualizados = []; const erros = [];

  // Pré-busca de existentes por nome+doc (pra dedup)
  let existentes = [];
  if (mergeExistentes) {
    try { existentes = await listAll(); } catch(_) { existentes = []; }
  }
  const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
  const findExistente = (nome, doc) => {
    if (doc) {
      const d = String(doc).replace(/\D/g,'');
      const m = existentes.find(e => e.doc && e.doc === d);
      if (m) return m;
    }
    const nm = norm(nome);
    return existentes.find(e => norm(e.nome) === nm);
  };

  for (let i = 1; i < lines.length; i++) {
    const linha = i + 1;
    const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g,''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });

    if (!row.nome) { erros.push({ linha, motivo:'nome obrigatório', raw: row }); continue; }

    if (dryRun) {
      const ex = findExistente(row.nome, row.doc);
      (ex ? atualizados : criados).push({ linha, payload: row, existenteId: ex?.id || null });
      continue;
    }

    try {
      const ex = findExistente(row.nome, row.doc);
      const data = { ...row, id: ex?.id || undefined };
      const saved = await upsert(data, who);
      (ex ? atualizados : criados).push({ linha, id: saved.id, nome: saved.nome });
    } catch(e) {
      erros.push({ linha, motivo: e.message, raw: row });
    }
  }
  return { dryRun, criados, atualizados, erros, total: lines.length - 1 };
}

module.exports = { ensureTable, listAll, get, searchByNome, upsert, remove, importCsv };
