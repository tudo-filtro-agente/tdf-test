// lib/sync.js — Orquestrador do sync OMIE → Postgres
// Etapa 2 / Parte 2
// Para cada empresa ativa, busca os dados na OMIE e faz UPSERT nas tabelas BI.
// Loga tudo na tabela sync_log.
//
// Modo de uso:
//   const { syncAll, syncOne, getStatus } = require('./lib/sync');
//   await syncAll();      // sincroniza todas as empresas
//   await syncOne(1);     // sincroniza só Mococa
//
// IMPORTANTE: o sync é SOMENTE LEITURA na OMIE (nenhuma escrita).
// Só grava/atualiza no NOSSO Postgres.

const { pool } = require('./auth');
const omie = require('./omie');

const ENTIDADES = [
  { key: 'contas_pagar',      fn: 'listarContasPagar',      table: 'contas_pagar',      listField: ['conta_pagar_cadastro', 'contas_pagar'] },
  { key: 'contas_receber',    fn: 'listarContasReceber',    table: 'contas_receber',    listField: ['conta_receber_cadastro', 'contas_receber'] },
  { key: 'movimentos',        fn: 'listarMovimentos',       table: 'movimentos',        listField: ['listaMovimentos', 'movimentos'] },
  { key: 'contas_bancarias',  fn: 'listarContasBancarias',  table: 'contas_bancarias',  listField: ['ListarContasCorrentes', 'contas_correntes', 'contas_bancarias'] },
  { key: 'categorias',        fn: 'listarCategorias',       table: 'categorias',        listField: ['ListarCategorias', 'categoria_cadastro', 'categorias'] },
  { key: 'nf_entrada',        fn: 'listarNfEntrada',        table: 'nf_entrada',        listField: ['movimentos', 'nf_entrada'] },
  { key: 'fornecedores',      fn: 'listarFornecedores',     table: 'fornecedores',      listField: ['clientes_cadastro', 'fornecedores'] },
];

async function getEmpresas() {
  const { rows } = await pool.query(`SELECT id, nome FROM empresas WHERE ativo = true ORDER BY id`);
  return rows;
}

async function startSyncLog(empresaId, triggeredBy = 'manual') {
  const { rows } = await pool.query(
    `INSERT INTO sync_log (empresa_id, tipo, started_at, status, triggered_by)
     VALUES ($1, 'all', NOW(), 'running', $2) RETURNING id`,
    [empresaId, triggeredBy]
  );
  return rows[0].id;
}

async function finishSyncLog(logId, status, totals, errorMsg = null) {
  // totals = JSON com chaves por entidade (somar tudo é só pra referência)
  const totalRegs = typeof totals === 'object' && totals !== null
    ? Object.values(totals).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
    : (typeof totals === 'number' ? totals : 0);
  await pool.query(
    `UPDATE sync_log
     SET finished_at = NOW(),
         status = $2,
         total_omie = $3,
         total_db = $3,
         error_msg = $4,
         duration_ms = COALESCE(
           (EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000)::int,
           0
         )
     WHERE id = $1`,
    [logId, status, totalRegs, errorMsg]
  );
}

// --------- MAPEADORES: OMIE real → formato do sync ---------
// OMIE retorna campos com nomes diferentes dos nossos mocks.
// Estes mappers traduzem dados REAIS da OMIE pra estrutura esperada.

// Converte data OMIE (DD/MM/YYYY) → ISO (YYYY-MM-DD) ou null
function dataOmie(s) {
  if (!s) return null;
  if (typeof s !== 'string') return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // Já está em formato ISO ou outro, retorna como está
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return null;
}

function mapContaPagarOmie(r) {
  return {
    codigo_lancamento_omie: r.codigo_lancamento_omie || r.codigo_lancamento || r.nCodTitulo || r.nCodLancamento,
    codigo_cliente_fornecedor: r.codigo_cliente_fornecedor || r.nCodCliente || 0,
    nome_cliente_fornecedor: r.nome_cliente_fornecedor || r.cRazCliente || r.cDesCliente || '(sem nome)',
    numero_documento: r.numero_documento || r.cNumero || '',
    numero_parcela: r.numero_parcela || r.cParcela || '001/001',
    valor_documento: Number(r.valor_documento || r.nValorDocumento || 0),
    valor_pago: Number(r.valor_pago || r.nValorPago || 0),
    data_emissao: dataOmie(r.data_emissao || r.dDtEmissao),
    data_vencimento: dataOmie(r.data_vencimento || r.dDtVencimento),
    data_pagamento: dataOmie(r.data_pagamento || r.dDtPagamento),
    status_lancamento: r.status_lancamento || r.cStatus || r.status || 'em_aberto',
    codigo_categoria: r.codigo_categoria || r.cCodCateg || null,
    observacao: r.observacao || r.cObservacao || null,
  };
}

function mapContaReceberOmie(r) {
  return {
    codigo_lancamento_omie: r.codigo_lancamento_omie || r.codigo_lancamento || r.nCodTitulo || r.nCodLancamento,
    codigo_cliente: r.codigo_cliente || r.nCodCliente || 0,
    nome_cliente: r.nome_cliente || r.cRazCliente || r.cDesCliente || '(sem nome)',
    numero_documento: r.numero_documento || r.cNumero || '',
    numero_parcela: r.numero_parcela || r.cParcela || '001/001',
    valor_documento: Number(r.valor_documento || r.nValorDocumento || 0),
    valor_recebido: Number(r.valor_recebido || r.nValorRecebido || 0),
    data_emissao: dataOmie(r.data_emissao || r.dDtEmissao),
    data_vencimento: dataOmie(r.data_vencimento || r.dDtVencimento),
    data_recebimento: dataOmie(r.data_recebimento || r.dDtRecebimento || r.dDtPagamento),
    status_lancamento: r.status_lancamento || r.cStatus || 'em_aberto',
    codigo_categoria: r.codigo_categoria || r.cCodCateg || null,
    observacao: r.observacao || r.cObservacao || null,
  };
}

function mapContaBancariaOmie(r) {
  return {
    codigo_conta_corrente: r.codigo_conta_corrente || r.nCodCC || r.codigo || 0,
    descricao: r.descricao || r.cDescricao || r.cBanco || '(sem descrição)',
    banco: r.banco || r.cBanco || r.nCodBanco || '',
    agencia: r.agencia || r.cAgencia || r.nCodAgencia || '',
    numero_conta: r.numero_conta || r.cNumero || r.nNumConta || '',
    tipo: r.tipo || r.cTipo || 'CC',
    saldo_atual: Number(r.saldo_atual || r.nSaldoAtual || 0),
    ativa: r.ativa !== false && r.bloqueado !== 'S',
  };
}

function mapCategoriaOmie(r) {
  return {
    codigo_categoria: r.codigo_categoria || r.codigo || r.cCodigo || '',
    nome: r.nome || r.cNome || r.cDescricao || '(sem nome)',
    tipo: r.tipo || r.cTipo || 'despesa',
  };
}

function mapMovimentoOmie(r) {
  // financas/mf: { detalhes: { cNatureza 'R' = receita, 'P' = pagamento, dDataLancamento, cDesCliente, nValorDocumento, cNumDocFiscal, cTipo, cStatus, ... } }
  const d = r.detalhes || r;
  const natureza = d.cNatureza || d.natureza || 'P';
  const tipo = (natureza === 'R' || natureza === 'C') ? 'credito' : 'debito';
  return {
    codigo_movimento: d.nCodLancamento || d.codigo_movimento || d.nCodMovimento || Math.floor(Math.random() * 1e9),
    conta_bancaria: d.cDesCliente || d.conta_bancaria || '',
    tipo,
    data_movimento: dataOmie(d.dDataLancamento || d.data_movimento || d.dDtEmissao),
    valor: Number(d.nValorDocumento || d.valor || 0),
    descricao: d.cObservacao || d.descricao || d.cTipo || '',
    categoria: d.cCodCateg || d.categoria || null,
    conciliado: !!(d.dDataConciliacao),
  };
}

function mapFornecedorOmie(r) {
  return {
    codigo_cliente_omie: r.codigo_cliente_omie || r.codigo_cliente || r.codigo || 0,
    razao_social: r.razao_social || r.nome_razao_social || r.nome || r.razaoSocial || '(sem nome)',
    nome_fantasia: r.nome_fantasia || r.fantasia || r.nomeFantasia || null,
    cnpj_cpf: r.cnpj_cpf || r.cnpjCpf || r.cnpj || '',
    email: r.email || r.email || '',
    telefone: r.telefone || r.telefone1 || '',
    cidade: r.cidade || '',
    estado: r.estado || '',
  };
}

function mapNfEntradaOmie(r) {
  // financas/mf.detalhes → nf entrada
  const d = r.detalhes || r;
  return {
    codigo_nf: d.nCodLancamento || d.codigo_nf || 0,
    numero_nf: d.cNumDocFiscal || d.numero_nf || '',
    serie: d.cSerie || '',
    data_emissao: dataOmie(d.dDtEmissao || d.data_emissao),
    data_entrada: dataOmie(d.dDtPagamento || d.dDataLancamento || d.data_entrada),
    valor_total: Number(d.nValorDocumento || d.valor_total || 0),
    nome_fornecedor: d.cRazCliente || d.cDesCliente || d.nome_fornecedor || '',
    cnpj_fornecedor: d.cCPFCNPJCliente || d.cnpj_fornecedor || '',
    chave_nfe: d.cChaveNFe || '',
  };
}

// ---------- UPSERTS ----------

async function upsertContasPagar(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapContaPagarOmie(r);
    await pool.query(
      `INSERT INTO contas_pagar
       (empresa_id, omie_codigo, codigo_fornecedor, nome_fornecedor, numero_documento, parcela,
        valor_documento, valor_pago, data_emissao, data_vencimento, data_pagamento,
        status, categoria, observacao, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         codigo_fornecedor = EXCLUDED.codigo_fornecedor,
         nome_fornecedor = EXCLUDED.nome_fornecedor,
         numero_documento = EXCLUDED.numero_documento,
         parcela = EXCLUDED.parcela,
         valor_documento = EXCLUDED.valor_documento,
         valor_pago = EXCLUDED.valor_pago,
         data_emissao = EXCLUDED.data_emissao,
         data_vencimento = EXCLUDED.data_vencimento,
         data_pagamento = EXCLUDED.data_pagamento,
         status = EXCLUDED.status,
         categoria = EXCLUDED.categoria,
         observacao = EXCLUDED.observacao,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_lancamento_omie,
        m.codigo_cliente_fornecedor,
        m.nome_cliente_fornecedor,
        m.numero_documento,
        m.numero_parcela,
        m.valor_documento,
        m.valor_pago,
        m.data_emissao,
        m.data_vencimento,
        m.data_pagamento,
        m.status_lancamento,
        m.codigo_categoria,
        m.observacao,
      ]
    );
    count++;
  }
  return count;
}

async function upsertContasReceber(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapContaReceberOmie(r);
    await pool.query(
      `INSERT INTO contas_receber
       (empresa_id, omie_codigo, codigo_cliente, nome_cliente, numero_documento, parcela,
        valor_documento, valor_recebido, data_emissao, data_vencimento, data_recebimento,
        status, categoria, observacao, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         codigo_cliente = EXCLUDED.codigo_cliente,
         nome_cliente = EXCLUDED.nome_cliente,
         numero_documento = EXCLUDED.numero_documento,
         parcela = EXCLUDED.parcela,
         valor_documento = EXCLUDED.valor_documento,
         valor_recebido = EXCLUDED.valor_recebido,
         data_emissao = EXCLUDED.data_emissao,
         data_vencimento = EXCLUDED.data_vencimento,
         data_recebimento = EXCLUDED.data_recebimento,
         status = EXCLUDED.status,
         categoria = EXCLUDED.categoria,
         observacao = EXCLUDED.observacao,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_lancamento_omie,
        m.codigo_cliente,
        m.nome_cliente,
        m.numero_documento,
        m.numero_parcela,
        m.valor_documento,
        m.valor_recebido,
        m.data_emissao || null,
        m.data_vencimento || null,
        m.data_recebimento || null,
        m.status_lancamento,
        m.codigo_categoria,
        m.observacao,
      ]
    );
    count++;
  }
  return count;
}

async function upsertMovimentos(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapMovimentoOmie(r);
    await pool.query(
      `INSERT INTO movimentos
       (empresa_id, omie_codigo, conta_bancaria, tipo, data_movimento, valor, descricao, categoria, conciliado, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         conta_bancaria = EXCLUDED.conta_bancaria,
         tipo = EXCLUDED.tipo,
         data_movimento = EXCLUDED.data_movimento,
         valor = EXCLUDED.valor,
         descricao = EXCLUDED.descricao,
         categoria = EXCLUDED.categoria,
         conciliado = EXCLUDED.conciliado,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_movimento,
        m.conta_bancaria,
        m.tipo,
        m.data_movimento || null,
        m.valor,
        m.descricao,
        m.categoria,
        m.conciliado,
      ]
    );
    count++;
  }
  return count;
}

async function upsertContasBancarias(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapContaBancariaOmie(r);
    await pool.query(
      `INSERT INTO contas_bancarias
       (empresa_id, omie_codigo, nome, banco, agencia, conta, tipo, saldo_atual, ativa, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         nome = EXCLUDED.nome,
         banco = EXCLUDED.banco,
         agencia = EXCLUDED.agencia,
         conta = EXCLUDED.conta,
         tipo = EXCLUDED.tipo,
         saldo_atual = EXCLUDED.saldo_atual,
         ativa = EXCLUDED.ativa,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_conta_corrente,
        m.descricao,
        m.banco,
        m.agencia,
        m.numero_conta,
        m.tipo,
        m.saldo_atual,
        m.ativa,
      ]
    );
    count++;
  }
  return count;
}

async function upsertCategorias(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapCategoriaOmie(r);
    await pool.query(
      `INSERT INTO categorias
       (empresa_id, omie_codigo, nome, tipo, synced_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         nome = EXCLUDED.nome,
         tipo = EXCLUDED.tipo,
         synced_at = NOW()`,
      [empresaId, m.codigo_categoria, m.nome, m.tipo]
    );
    count++;
  }
  return count;
}

async function upsertNfEntrada(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapNfEntradaOmie(r);
    await pool.query(
      `INSERT INTO nf_entrada
       (empresa_id, omie_codigo, numero, serie, chave_acesso, codigo_fornecedor, nome_fornecedor,
        data_emissao, data_entrada, valor_total, valor_produtos, valor_impostos, status, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         numero = EXCLUDED.numero,
         serie = EXCLUDED.serie,
         chave_acesso = EXCLUDED.chave_acesso,
         codigo_fornecedor = EXCLUDED.codigo_fornecedor,
         nome_fornecedor = EXCLUDED.nome_fornecedor,
         data_emissao = EXCLUDED.data_emissao,
         data_entrada = EXCLUDED.data_entrada,
         valor_total = EXCLUDED.valor_total,
         valor_produtos = EXCLUDED.valor_produtos,
         valor_impostos = EXCLUDED.valor_impostos,
         status = EXCLUDED.status,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_nf,
        m.numero_nf,
        m.serie,
        m.chave_nfe,
        0, // codigo_fornecedor (não temos do financas/mf)
        m.nome_fornecedor,
        m.data_emissao || null,
        m.data_entrada || null,
        m.valor_total,
        null, // valor_produtos
        null, // valor_impostos
        'entrada',
      ]
    );
    count++;
  }
  return count;
}

async function upsertFornecedores(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    const m = mapFornecedorOmie(r);
    await pool.query(
      `INSERT INTO fornecedores
       (empresa_id, omie_codigo, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_codigo) DO UPDATE SET
         razao_social = EXCLUDED.razao_social,
         nome_fantasia = EXCLUDED.nome_fantasia,
         cnpj_cpf = EXCLUDED.cnpj_cpf,
         email = EXCLUDED.email,
         telefone = EXCLUDED.telefone,
         cidade = EXCLUDED.cidade,
         estado = EXCLUDED.estado,
         synced_at = NOW()`,
      [
        empresaId,
        m.codigo_cliente_omie,
        m.razao_social,
        m.nome_fantasia,
        m.cnpj_cpf,
        m.email,
        m.telefone,
        m.cidade,
        m.estado,
      ]
    );
    count++;
  }
  return count;
}

// syncMovimentos: precisa de nCodCC para cada conta corrente.
// Estratégia: busca as contas correntes já sincronizadas no Postgres,
// depois chama listarMovimentos() uma vez por conta.
async function syncMovimentos(empresa) {
  console.log(`[sync] ${empresa.nome}.movimentos: buscando CCs ativas`);
  const r = await pool.query(
    `SELECT omie_codigo FROM contas_bancarias WHERE empresa_id = $1 AND ativa = true ORDER BY omie_codigo`,
    [empresa.id]
  );
  const contasCC = r.rows.map(x => Number(x.omie_codigo)).filter(Boolean);
  console.log(`[sync] ${empresa.nome}.movimentos: ${contasCC.length} CCs encontradas:`, contasCC);
  if (!contasCC.length) {
    console.log(`[sync] ${empresa.nome}.movimentos: nenhuma conta corrente ativa, pulando`);
    return 0;
  }
  let totalCount = 0;
  for (const nCodCC of contasCC) {
    try {
      const data = await omie.listarMovimentos(empresa.nome, { nCodCC });
      const fields = ['listaMovimentos', 'movimentos'];
      let rows = [];
      for (const f of fields) {
        if (Array.isArray(data[f])) { rows = data[f]; break; }
      }
      if (!rows.length) {
        console.log(`[sync] ${empresa.nome}.movimentos CC=${nCodCC}: 0 registros`);
        continue;
      }
      const n = await upsertMovimentos(empresa.id, rows);
      totalCount += n;
      console.log(`[sync] ${empresa.nome}.movimentos CC=${nCodCC}: ${n} registros`);
    } catch (e) {
      console.error(`[sync] ${empresa.nome}.movimentos CC=${nCodCC} ERRO:`, e.message);
    }
  }
  return totalCount;
}

async function syncEntity(empresa, entity, forceDryRun = false) {
  // movimentos usa estratégia diferente (syncMovimentos faz iteração por CC)
  if (entity.key === 'movimentos') {
    return await syncMovimentos(empresa);
  }
  let data;
  if (forceDryRun && omie.DRY_RUN === false) {
    // OMIE está em produção; o usuário pediu um sync de teste
    // Usamos os mocks internos sem mexer na env var global
    const mocks = {
      contas_pagar: 'mockContasPagar',
      contas_receber: 'mockContasReceber',
      movimentos: 'mockMovimentos',
      contas_bancarias: 'mockContasBancarias',
      categorias: 'mockCategorias',
      nf_entrada: 'mockNfEntrada',
      fornecedores: 'mockFornecedores',
    };
    const mockName = mocks[entity.key];
    data = omie[mockName] ? omie[mockName](empresa.nome) : await omie[entity.fn](empresa.nome);
  } else {
    data = await omie[entity.fn](empresa.nome);
  }
  // listField pode ser string ou array de nomes possíveis (mock vs OMIE real)
  const fields = Array.isArray(entity.listField) ? entity.listField : [entity.listField];
  let rows = [];
  for (const f of fields) {
    if (Array.isArray(data[f])) { rows = data[f]; break; }
  }
  if (!rows.length) rows = data[entity.key] || [];
  if (!rows.length) return 0;

  switch (entity.key) {
    case 'contas_pagar':     return await upsertContasPagar(empresa.id, rows);
    case 'contas_receber':   return await upsertContasReceber(empresa.id, rows);
    case 'contas_bancarias': return await upsertContasBancarias(empresa.id, rows);
    case 'categorias':       return await upsertCategorias(empresa.id, rows);
    case 'nf_entrada':       return await upsertNfEntrada(empresa.id, rows);
    case 'fornecedores':     return await upsertFornecedores(empresa.id, rows);
    default: return 0;
  }
}

async function syncEmpresa(empresa, triggeredBy = 'manual', forceDryRun = false) {
  const logId = await startSyncLog(empresa.id, triggeredBy);
  const totals = {};
  let overallStatus = 'success';
  let errorMsg = null;

  try {
    for (const entity of ENTIDADES) {
      try {
        const n = await syncEntity(empresa, entity, forceDryRun);
        totals[entity.key] = n;
      } catch (e) {
        console.error(`[sync] ERRO ${empresa.nome}.${entity.key}:`, e.message);
        totals[entity.key] = 0;
        overallStatus = 'partial';
      }
    }
  } catch (e) {
    overallStatus = 'error';
    errorMsg = e.message;
    console.error(`[sync] ERRO GERAL ${empresa.nome}:`, e);
  }

  const totalRegs = Object.values(totals).reduce((a, b) => a + b, 0);
  await finishSyncLog(logId, overallStatus, totalRegs, errorMsg);

  console.log(`[sync] ${empresa.nome} → ${overallStatus} (${totalRegs} registros, dry=${forceDryRun})`);
  return { empresa: empresa.nome, status: overallStatus, total: totalRegs, detalhes: totals };
}

async function syncAll(triggeredBy = 'manual', forceDryRun = false) {
  const empresas = await getEmpresas();
  console.log(`[sync] INÍCIO — ${empresas.length} empresas, triggered_by=${triggeredBy}, dry=${forceDryRun}`);
  const results = [];
  for (const empresa of empresas) {
    results.push(await syncEmpresa(empresa, triggeredBy, forceDryRun));
  }
  console.log(`[sync] FIM — ${results.length} empresas processadas`);
  return results;
}

async function syncOne(empresaId, triggeredBy = 'manual', forceDryRun = false) {
  const { rows } = await pool.query(`SELECT id, nome FROM empresas WHERE id = $1 AND ativo = true`, [empresaId]);
  if (!rows.length) throw new Error(`Empresa ${empresaId} não encontrada ou inativa`);
  return await syncEmpresa(rows[0], triggeredBy, forceDryRun);
}

async function getStatus() {
  const counts = {};
  const tabelas = ['contas_pagar', 'contas_receber', 'movimentos', 'contas_bancarias', 'categorias', 'nf_entrada', 'fornecedores'];
  for (const t of tabelas) {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM ${t}`);
    counts[t] = rows[0].n;
  }
  const { rows: lastSyncs } = await pool.query(
    `SELECT sl.id, e.nome AS empresa, sl.started_at, sl.finished_at, sl.status,
            sl.total_db AS registros_processados, sl.duration_ms, sl.triggered_by, sl.error_msg AS error_message
       FROM sync_log sl
       JOIN empresas e ON e.id = sl.empresa_id
       ORDER BY sl.started_at DESC
       LIMIT 20`
  );
  return { counts, ultimos_syncs: lastSyncs };
}

module.exports = { syncAll, syncOne, syncEmpresa, getStatus };
