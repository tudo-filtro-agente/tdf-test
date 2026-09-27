/**
 * Backfill: manut-meta.timeline → crm_audit_logs
 *
 * Usado tanto pelo script CLI (scripts/backfill-audit-from-timeline.js)
 * quanto pelo endpoint admin POST /api/auditoria-crm/admin/backfill-from-timeline.
 *
 * Idempotente via metadata_json._backfill_key = `${dealId}|${at}|${label}`.
 */

// Parser do label do timeline. Formatos suportados:
//  "Atribuído auto pra Felipe (round_robin_bebedouro) · CRM owner: Felipe Braga"
//  "Atribuído auto (batch) pra Felipe (round_robin_bebedouro)"
//  "Atribuído a felipe (distribuição massa)"
//  "Atribuído a felipe"
//  "Operadora: felipe (ação em massa)"
//  "Operadora atribuída: felipe"
function parseLabel(label) {
  if (!label || typeof label !== 'string') return { seller: null, motivo: null };
  const patterns = [
    /Atribuído(?:\s+auto)?(?:\s*\(batch\))?\s+pra\s+(.+?)\s*(?:\(([^)]+)\)|·|$)/i,
    /Atribuído\s+a\s+(.+?)\s*(?:\(([^)]+)\)|·|$)/i,
    /Operadora(?:\s+atribuída)?:\s*(.+?)\s*(?:\(([^)]+)\)|·|$)/i,
  ];
  for (const re of patterns) {
    const m = label.match(re);
    if (m) {
      return {
        seller: (m[1] || '').trim() || null,
        motivo: (m[2] || '').trim() || null,
      };
    }
  }
  return { seller: null, motivo: null };
}

/**
 * Roda o backfill.
 * @param {pg.Pool} pool
 * @param {object} opts
 * @param {Date|string|null} opts.since — só processa eventos a partir dessa data
 * @param {boolean} opts.dryRun — não grava, só conta
 * @param {function(string):void} [opts.log] — callback opcional pra logging incremental
 * @returns {{events_total, inserted, skipped, parse_fail, deals_total, since, dry_run}}
 */
async function backfillFromTimeline(pool, opts = {}) {
  const dryRun = opts.dryRun === true;
  const since = opts.since ? new Date(opts.since) : null;
  const log = typeof opts.log === 'function' ? opts.log : () => {};

  const client = await pool.connect();
  try {
    const kv = await client.query(`SELECT value FROM kv_store WHERE key='manut-meta'`);
    if (!kv.rows.length) {
      throw new Error('manut-meta não encontrada em kv_store');
    }
    const meta = kv.rows[0].value || {};
    const dealIds = Object.keys(meta);
    log(`${dealIds.length} deals no manut-meta`);

    const events = [];
    for (const dealId of dealIds) {
      const m = meta[dealId] || {};
      const tl = Array.isArray(m.timeline) ? m.timeline : [];
      for (const ev of tl) {
        if (!ev || !ev.at) continue;
        const tipo = String(ev.tipo || '');
        if (tipo !== 'atribuicao' && tipo !== 'operadora') continue;
        const at = new Date(ev.at);
        if (Number.isNaN(at.getTime())) continue;
        if (since && at < since) continue;
        events.push({
          dealId: String(dealId),
          dealNome: m.nome || null,
          at,
          tipo,
          label: ev.label || '',
          by: ev.by || null,
        });
      }
    }
    events.sort((a, b) => a.at - b.at);
    log(`${events.length} eventos candidatos${since ? ` (since ${since.toISOString()})` : ''}`);

    let inserted = 0, skipped = 0, parseFail = 0;
    for (const ev of events) {
      const key = `${ev.dealId}|${ev.at.toISOString()}|${ev.label}`;
      const exists = await client.query(
        `SELECT 1 FROM crm_audit_logs
          WHERE crm_record_id=$1
            AND action_type='lead_assigned'
            AND metadata_json->>'_backfill_key'=$2
          LIMIT 1`,
        [ev.dealId, key]
      );
      if (exists.rowCount > 0) { skipped++; continue; }

      const { seller, motivo } = parseLabel(ev.label);
      if (!seller) parseFail++;

      if (dryRun) continue;

      await client.query(
        `INSERT INTO crm_audit_logs (
          occurred_at, crm_module, crm_record_id, crm_record_name,
          action_type, action_origin, actor_name,
          seller_responsible_after, reason, rule_triggered,
          related_channel, validation_status, impact_type, metadata_json
        ) VALUES ($1,'Deals',$2,$3,'lead_assigned','manager_manual',$4,$5,$6,$7,'portal','valid','unknown',$8)`,
        [
          ev.at,
          ev.dealId,
          ev.dealNome,
          ev.by,
          seller,
          `backfill ${ev.tipo}: ${ev.label}`.slice(0, 500),
          motivo || ev.tipo,
          JSON.stringify({ _backfill_key: key, _backfill: true, tipo: ev.tipo, source_label: ev.label, endpoint: 'backfill' })
        ]
      );
      inserted++;
      if (inserted % 200 === 0) log(`${inserted} inseridos…`);
    }

    return {
      deals_total: dealIds.length,
      events_total: events.length,
      inserted,
      skipped,
      parse_fail: parseFail,
      since: since ? since.toISOString() : null,
      dry_run: dryRun,
    };
  } finally {
    client.release();
  }
}

module.exports = { backfillFromTimeline, parseLabel };
