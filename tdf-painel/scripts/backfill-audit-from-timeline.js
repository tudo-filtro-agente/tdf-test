#!/usr/bin/env node
/**
 * CLI wrapper pro backfill timeline → crm_audit_logs.
 * Lógica em lib/auditoria-crm/backfill.js (compartilhada com endpoint admin).
 *
 * Uso:
 *   DATABASE_URL=... node scripts/backfill-audit-from-timeline.js
 *   DATABASE_URL=... node scripts/backfill-audit-from-timeline.js --dry-run
 *   DATABASE_URL=... node scripts/backfill-audit-from-timeline.js --since 2026-04-01
 */

const { Pool } = require('pg');
const { backfillFromTimeline } = require('../lib/auditoria-crm/backfill');

const DRY = process.argv.includes('--dry-run');
const sinceIdx = process.argv.indexOf('--since');
const SINCE = sinceIdx > -1 ? process.argv[sinceIdx + 1] : null;

if (!process.env.DATABASE_URL) {
  console.error('ERRO: DATABASE_URL ausente');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway.internal') ? false : { rejectUnauthorized: false },
  max: 3
});

(async () => {
  try {
    const stats = await backfillFromTimeline(pool, {
      since: SINCE,
      dryRun: DRY,
      log: msg => console.log(`[backfill] ${msg}`),
    });
    console.log('\n[backfill] DONE');
    console.log(`  deals:      ${stats.deals_total}`);
    console.log(`  candidatos: ${stats.events_total}`);
    console.log(`  inseridos:  ${stats.inserted}`);
    console.log(`  skipped:    ${stats.skipped} (já existiam)`);
    console.log(`  sem seller: ${stats.parse_fail} (label não parseou — ainda inseriu)`);
    if (stats.dry_run) console.log('  (dry-run — nada foi gravado)');
  } catch (e) {
    console.error('[backfill] erro:', e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
