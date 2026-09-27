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
  { key: 'contas_pagar',      fn: 'listarContasPagar',      table: 'contas_pagar',      listField: 'contas_pagar' },
  { key: 'contas_receber',    fn: 'listarContasReceber',    table: 'contas_receber',    listField: 'contas_receber' },
  { key: 'movimentos',        fn: 'listarMovimentos',       table: 'movimentos',        listField: 'movimentos' },
  { key: 'contas_bancarias',  fn: 'listarContasBancarias',  table: 'contas_bancarias',  listField: 'contas_bancarias' },
  { key: 'categorias',        fn: 'listarCategorias',       table: 'categorias',        listField: 'categorias' },
  { key: 'nf_entrada',        fn: 'listarNfEntrada',        table: 'nf_entrada',        listField: 'nf_entrada' },
  { key: 'fornecedores',      fn: 'listarFornecedores',     table: 'fornecedores',      listField: 'fornecedores' },
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

async function upsertContasPagar(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO contas_pagar
       (empresa_id, omie_id, fornecedor_id, fornecedor_nome, numero_documento, numero_parcela,
        valor_documento, valor_pago, data_emissao, data_vencimento, data_pagamento,
        status, categoria_codigo, observacao, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
         fornecedor_id = EXCLUDED.fornecedor_id,
         fornecedor_nome = EXCLUDED.fornecedor_nome,
         numero_documento = EXCLUDED.numero_documento,
         numero_parcela = EXCLUDED.numero_parcela,
         valor_documento = EXCLUDED.valor_documento,
         valor_pago = EXCLUDED.valor_pago,
         data_emissao = EXCLUDED.data_emissao,
         data_vencimento = EXCLUDED.data_vencimento,
         data_pagamento = EXCLUDED.data_pagamento,
         status = EXCLUDED.status,
         categoria_codigo = EXCLUDED.categoria_codigo,
         observacao = EXCLUDED.observacao,
         synced_at = NOW()`,
      [
        empresaId,
        r.codigo_lancamento_omie,
        r.codigo_cliente_fornecedor,
        r.nome_cliente_fornecedor,
        r.numero_documento,
        r.numero_parcela,
        r.valor_documento,
        r.valor_pago,
        r.data_emissao || null,
        r.data_vencimento || null,
        r.data_pagamento || null,
        r.status_lancamento,
        r.codigo_categoria,
        r.observacao,
      ]
    );
    count++;
  }
  return count;
}

async function upsertContasReceber(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO contas_receber
       (empresa_id, omie_id, cliente_id, cliente_nome, numero_documento, numero_parcela,
        valor_documento, valor_recebido, data_emissao, data_vencimento, data_recebimento,
        status, categoria_codigo, observacao, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
         cliente_id = EXCLUDED.cliente_id,
         cliente_nome = EXCLUDED.cliente_nome,
         numero_documento = EXCLUDED.numero_documento,
         numero_parcela = EXCLUDED.numero_parcela,
         valor_documento = EXCLUDED.valor_documento,
         valor_recebido = EXCLUDED.valor_recebido,
         data_emissao = EXCLUDED.data_emissao,
         data_vencimento = EXCLUDED.data_vencimento,
         data_recebimento = EXCLUDED.data_recebimento,
         status = EXCLUDED.status,
         categoria_codigo = EXCLUDED.categoria_codigo,
         observacao = EXCLUDED.observacao,
         synced_at = NOW()`,
      [
        empresaId,
        r.codigo_lancamento_omie,
        r.codigo_cliente_fornecedor,
        r.nome_cliente_fornecedor,
        r.numero_documento,
        r.numero_parcela,
        r.valor_documento,
        r.valor_recebido,
        r.data_emissao || null,
        r.data_vencimento || null,
        r.data_recebimento || null,
        r.status_lancamento,
        r.codigo_categoria,
        r.observacao,
      ]
    );
    count++;
  }
  return count;
}

async function upsertMovimentos(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO movimentos
       (empresa_id, omie_id, conta_bancaria, tipo, data_movimento, valor, descricao, categoria, conciliado, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
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
        r.codigo_movimento,
        r.conta_bancaria,
        r.tipo,
        r.data_movimento || null,
        r.valor,
        r.descricao,
        r.categoria,
        r.conciliado,
      ]
    );
    count++;
  }
  return count;
}

async function upsertContasBancarias(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO contas_bancarias
       (empresa_id, omie_id, nome, banco, agencia, conta, tipo, saldo_atual, ativa, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
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
        r.codigo_conta_corrente,
        r.nome,
        r.banco,
        r.agencia,
        r.conta,
        r.tipo,
        r.saldo_atual,
        r.ativa,
      ]
    );
    count++;
  }
  return count;
}

async function upsertCategorias(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO categorias
       (empresa_id, codigo, nome, tipo, synced_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (empresa_id, codigo) DO UPDATE SET
         nome = EXCLUDED.nome,
         tipo = EXCLUDED.tipo,
         synced_at = NOW()`,
      [empresaId, r.codigo_categoria, r.nome, r.tipo]
    );
    count++;
  }
  return count;
}

async function upsertNfEntrada(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO nf_entrada
       (empresa_id, omie_id, numero, serie, chave_acesso, fornecedor_id, fornecedor_nome,
        data_emissao, data_entrada, valor_total, valor_produtos, valor_impostos, status, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
         numero = EXCLUDED.numero,
         serie = EXCLUDED.serie,
         chave_acesso = EXCLUDED.chave_acesso,
         fornecedor_id = EXCLUDED.fornecedor_id,
         fornecedor_nome = EXCLUDED.fornecedor_nome,
         data_emissao = EXCLUDED.data_emissao,
         data_entrada = EXCLUDED.data_entrada,
         valor_total = EXCLUDED.valor_total,
         valor_produtos = EXCLUDED.valor_produtos,
         valor_impostos = EXCLUDED.valor_impostos,
         status = EXCLUDED.status,
         synced_at = NOW()`,
      [
        empresaId,
        r.codigo_nf,
        r.numero,
        r.serie,
        r.chave_acesso,
        r.codigo_fornecedor,
        r.nome_fornecedor,
        r.data_emissao || null,
        r.data_entrada || null,
        r.valor_total,
        r.valor_produtos,
        r.valor_impostos,
        r.status,
      ]
    );
    count++;
  }
  return count;
}

async function upsertFornecedores(empresaId, rows) {
  let count = 0;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO fornecedores
       (empresa_id, omie_id, razao_social, nome_fantasia, cnpj_cpf, email, telefone, cidade, estado, synced_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (empresa_id, omie_id) DO UPDATE SET
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
        r.codigo_cliente_omie,
        r.razao_social,
        r.nome_fantasia,
        r.cnpj_cpf,
        r.email,
        r.telefone,
        r.cidade,
        r.estado,
      ]
    );
    count++;
  }
  return count;
}

async function syncEntity(empresa, entity, forceDryRun = false) {
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
  const rows = data[entity.listField] || data[entity.key] || [];
  if (!rows.length) return 0;

  switch (entity.key) {
    case 'contas_pagar':     return await upsertContasPagar(empresa.id, rows);
    case 'contas_receber':   return await upsertContasReceber(empresa.id, rows);
    case 'movimentos':       return await upsertMovimentos(empresa.id, rows);
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
