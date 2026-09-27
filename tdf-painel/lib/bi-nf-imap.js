// lib/bi-nf-imap.js — Monitor IMAP que ingere XML de NF-e por email
//
// A cada N minutos (default 5):
// 1. Conecta na caixa via imapflow (TLS)
// 2. Lista UIDs não-lidos com anexo (.xml ou .zip contendo .xml)
// 3. Pra cada email: parseia com mailparser, extrai XMLs, chama bi-nf-entrada.ingest
// 4. Marca email como lido (\\Seen) e (opcionalmente) move pra pasta 'Processado'
// 5. Loga última execução + erros em estado em memória (exposto via /status)
//
// Config via env:
//   NF_IMAP_HOST       (ex: imap.uol.com.br)
//   NF_IMAP_PORT       (993 padrão)
//   NF_IMAP_USER       (ex: nfe@tudodefiltro.com.br)
//   NF_IMAP_PASS
//   NF_IMAP_MAILBOX    (default 'INBOX')
//   NF_IMAP_MOVE_TO    (default 'Processado' — falha silenciosamente se não existir)
//   NF_IMAP_INTERVAL_MIN (default 5)
//   NF_IMAP_ENABLED    ('true' pra ligar — se ausente, monitor fica desligado)

const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const AdmZip = (() => { try { return require('adm-zip'); } catch(_) { return null; } })();
const biNfEntrada = require('./bi-nf-entrada');

const STATE = {
  enabled: false,
  rodando: false,
  ultimaExec: null,
  ultimoErro: null,
  totais: { execs: 0, emailsLidos: 0, xmlsIngeridos: 0, duplicados: 0, erros: 0 },
  proximaExecISO: null,
};

let _timer = null;

function _envInt(name, def) {
  const v = parseInt(process.env[name] || '', 10);
  return isNaN(v) ? def : v;
}

function getStatus() {
  return { ...STATE };
}

function _extractXmlsFromAttachment(att) {
  // Att = { content: Buffer, filename, contentType }
  const out = [];
  const fname = (att.filename || '').toLowerCase();
  const isXml = fname.endsWith('.xml') || (att.contentType||'').includes('xml');
  const isZip = fname.endsWith('.zip') || (att.contentType||'').includes('zip');
  if (isXml) {
    out.push({ filename: att.filename, content: att.content.toString('utf8') });
  } else if (isZip && AdmZip) {
    try {
      const zip = new AdmZip(att.content);
      for (const entry of zip.getEntries()) {
        if (entry.entryName.toLowerCase().endsWith('.xml')) {
          out.push({ filename: entry.entryName, content: entry.getData().toString('utf8') });
        }
      }
    } catch(e) { console.warn('[bi-nf-imap] zip falhou:', e.message); }
  }
  return out;
}

async function _processarUmaCaixa() {
  const host = process.env.NF_IMAP_HOST;
  const port = _envInt('NF_IMAP_PORT', 993);
  const user = process.env.NF_IMAP_USER;
  const pass = process.env.NF_IMAP_PASS;
  const mailbox = process.env.NF_IMAP_MAILBOX || 'INBOX';
  const moveTo = process.env.NF_IMAP_MOVE_TO || 'Processado';
  if (!host || !user || !pass) throw new Error('NF_IMAP_HOST/USER/PASS não configurados');

  const client = new ImapFlow({
    host, port, secure: port === 993,
    auth: { user, pass },
    logger: false,
    socketTimeout: 30000,
  });
  await client.connect();
  let emailsLidos = 0, xmlsIngeridos = 0, duplicados = 0, erros = 0;
  try {
    const lock = await client.getMailboxLock(mailbox);
    try {
      // Busca não-lidos
      const uids = await client.search({ seen: false }, { uid: true });
      for (const uid of uids) {
        try {
          // Baixa source bruto
          const { source } = await client.fetchOne(uid, { source: true }, { uid: true });
          if (!source) continue;
          const mail = await simpleParser(source);
          emailsLidos++;
          // Procura XMLs em anexos
          const xmls = [];
          for (const att of (mail.attachments || [])) {
            xmls.push(..._extractXmlsFromAttachment(att));
          }
          if (xmls.length === 0) {
            // Sem XML — só marca como lido pra não reprocessar (se quiser)
            await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true });
            continue;
          }
          for (const x of xmls) {
            try {
              const r = await biNfEntrada.ingest(x.content, {
                origem: 'imap',
                emailUid: String(uid),
                emailFrom: (mail.from?.text || '').slice(0,200),
                emailSubject: (mail.subject || '').slice(0,200),
                emailReceivedAt: mail.date || new Date(),
                xmlFilename: x.filename,
              }, 'nf-imap');
              if (r.duplicada) duplicados++; else xmlsIngeridos++;
            } catch(e) {
              erros++;
              console.warn('[bi-nf-imap] ingest falhou:', x.filename, '-', e.message);
            }
          }
          // Marca lido + tenta mover
          await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true });
          if (moveTo) {
            try { await client.messageMove({ uid }, moveTo, { uid: true }); }
            catch(_) { /* pasta destino pode não existir, ignora */ }
          }
        } catch(e) {
          erros++;
          console.error('[bi-nf-imap] processar email uid='+uid, e.message);
        }
      }
    } finally { lock.release(); }
  } finally {
    try { await client.logout(); } catch(_) {}
  }
  return { emailsLidos, xmlsIngeridos, duplicados, erros };
}

async function runOnce() {
  if (STATE.rodando) return { skipped:true, motivo:'execução anterior ainda rodando' };
  STATE.rodando = true;
  const inicio = Date.now();
  try {
    const r = await _processarUmaCaixa();
    STATE.totais.execs++;
    STATE.totais.emailsLidos += r.emailsLidos;
    STATE.totais.xmlsIngeridos += r.xmlsIngeridos;
    STATE.totais.duplicados += r.duplicados;
    STATE.totais.erros += r.erros;
    STATE.ultimaExec = { ts: new Date().toISOString(), durMs: Date.now()-inicio, ...r };
    STATE.ultimoErro = null;
    return { ok:true, ...r };
  } catch(e) {
    STATE.ultimoErro = { ts: new Date().toISOString(), msg: e.message };
    console.error('[bi-nf-imap] runOnce ERRO:', e.message);
    return { ok:false, error: e.message };
  } finally {
    STATE.rodando = false;
  }
}

function start() {
  const enabled = process.env.NF_IMAP_ENABLED === 'true';
  STATE.enabled = enabled;
  if (!enabled) {
    console.log('[bi-nf-imap] desligado (NF_IMAP_ENABLED != true)');
    return;
  }
  const intervalMin = _envInt('NF_IMAP_INTERVAL_MIN', 5);
  console.log(`[bi-nf-imap] ligado, intervalo ${intervalMin}min, host=${process.env.NF_IMAP_HOST} user=${process.env.NF_IMAP_USER} box=${process.env.NF_IMAP_MAILBOX || 'INBOX'}`);
  // Roda 30s depois do boot (não bloqueia start do servidor)
  setTimeout(() => { runOnce().catch(_=>{}); }, 30000);
  _timer = setInterval(() => {
    runOnce().catch(_=>{});
    STATE.proximaExecISO = new Date(Date.now() + intervalMin*60000).toISOString();
  }, intervalMin * 60 * 1000);
  STATE.proximaExecISO = new Date(Date.now() + 30000).toISOString();
}

function stop() {
  if (_timer) { clearInterval(_timer); _timer = null; }
}

module.exports = { start, stop, runOnce, getStatus };
