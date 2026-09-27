#!/usr/bin/env node
/**
 * Envia email com as credenciais do user 'financeiro' pra financeiro@tudodefiltro.com.br
 *
 * Usa o mesmo SMTP do portal (informativo@tudodefiltro.com.br via smtp.suite.uol).
 *
 * Uso:
 *   SMTP_PASS='senha-do-informativo' node scripts/send-credenciais-financeiro.js
 *
 * Em produção (Railway), o SMTP_PASS já está nas env vars; basta:
 *   railway run node scripts/send-credenciais-financeiro.js
 */

const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.suite.uol';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'informativo@tudodefiltro.com.br';
const SMTP_PASS = process.env.SMTP_PASS || '';

const PORTAL_URL = process.env.PORTAL_URL || 'https://tdf-portal-production.up.railway.app';

// As credenciais que cadastramos em server.js → USERS['financeiro']
const LOGIN_USERNAME = 'financeiro';
const LOGIN_PASSWORD = 'TdfFin@2026!';
const TO_EMAIL = process.env.TO_EMAIL || 'informativo@tudodefiltro.com.br';

if (!SMTP_PASS) {
  console.error('\n❌ ERRO: SMTP_PASS não definido.');
  console.error('   Rode:  SMTP_PASS=\'senha-do-informativo\' node scripts/send-credenciais-financeiro.js');
  console.error('   Ou em produção:  railway run node scripts/send-credenciais-financeiro.js\n');
  process.exit(1);
}

const subject = '🔐 Acesso ao Portal TDF — Cris e Elo (BI Financeiro + CRM + Operacional)';

const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6fa;padding:30px 10px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.08)">
    <tr><td style="background:linear-gradient(135deg,#0066CC,#22C55E);padding:26px;text-align:center;color:#fff">
      <div style="font-size:13px;letter-spacing:2px;opacity:.85;margin-bottom:6px">PORTAL TDF</div>
      <div style="font-size:22px;font-weight:800">Acesso liberado · Cris e Elo</div>
      <div style="font-size:13px;opacity:.92;margin-top:6px">Login compartilhado pelo financeiro</div>
    </td></tr>
    <tr><td style="padding:28px 32px;color:#1f2937;font-size:15px;line-height:1.55">
      <p style="margin:0 0 14px 0">Oi, Cris e Elo!</p>
      <p style="margin:0 0 14px 0">Seguem as credenciais de acesso ao <b>Portal TDF</b>. As duas usam o mesmo login. Cada vez que uma de vocês fizer login, sai a outra automaticamente (sessão única) — então combinem entre vocês quem está ativa no momento.</p>

      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;margin:18px 0">
        <tr><td style="padding:18px 22px">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:700">Site</div>
          <div style="font-size:15px;font-weight:700;color:#0066CC;margin-top:4px"><a href="${PORTAL_URL}" style="color:#0066CC;text-decoration:none">${PORTAL_URL}</a></div>
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:14px 0">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:700">Usuário</div>
          <div style="font-size:17px;font-weight:800;color:#111827;margin-top:4px;font-family:'Courier New',monospace">${LOGIN_USERNAME}</div>
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:14px 0">
          <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:700">Senha</div>
          <div style="font-size:17px;font-weight:800;color:#111827;margin-top:4px;font-family:'Courier New',monospace">${LOGIN_PASSWORD}</div>
        </td></tr>
      </table>

      <p style="margin:14px 0 8px 0"><b>O que vocês têm acesso:</b></p>
      <table role="presentation" style="width:100%;margin:0 0 14px 0">
        <tr><td style="padding:6px 0;font-size:14px">💰 <b>BI Financeiro Multiempresa</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Pagamentos, Recebimentos, Bancos, DRE, Fluxo de Caixa, Aprovações, NF-e, Vendas Zoho, Dashboard CEO</td></tr>
        <tr><td style="padding:6px 0;font-size:14px">🗂️ <b>CRM (Manutenção)</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Ficha do cliente, histórico, propostas</td></tr>
        <tr><td style="padding:6px 0;font-size:14px">📇 <b>Contatos</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Lista geral de contatos</td></tr>
        <tr><td style="padding:6px 0;font-size:14px">💬 <b>Inbox WhatsApp</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Mensagens WATI + Z-API</td></tr>
        <tr><td style="padding:6px 0;font-size:14px">🛠 <b>Operacional</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Vendas + rotas + técnicos</td></tr>
        <tr><td style="padding:6px 0;font-size:14px">📍 <b>Auvo</b></td><td style="padding:6px 0;color:#6b7280;font-size:13px">Atendimentos de campo</td></tr>
      </table>

      <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px 14px;margin:18px 0;color:#78350f;font-size:13px">
        <b>⚠️ Não têm acesso a:</b> Cockpit, Admin, Gestão Geral, painéis de comissão dos closers, integrações. Restritos.
      </div>

      <p style="margin:16px 0 8px 0"><b>Como começar:</b></p>
      <ol style="margin:0 0 14px 18px;padding:0;color:#374151">
        <li style="margin-bottom:6px">Abrir <a href="${PORTAL_URL}" style="color:#0066CC">${PORTAL_URL}</a></li>
        <li style="margin-bottom:6px">Digitar usuário e senha</li>
        <li style="margin-bottom:6px">O sistema abre direto no <b>BI Financeiro</b></li>
        <li>Navegar pelos outros módulos pelo menu de cima</li>
      </ol>

      <p style="margin:18px 0 8px 0;color:#6b7280;font-size:13px">Qualquer dúvida me chamam no WhatsApp.</p>
      <p style="margin:24px 0 0 0;color:#6b7280;font-size:13px">Abraço,<br>Paulo</p>
    </td></tr>
    <tr><td style="background:#f8fafc;padding:14px 22px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;text-align:center">
      Portal TDF · Tudo de Filtro · informativo@tudodefiltro.com.br
    </td></tr>
  </table>
</body></html>`;

const text = [
  'Oi, Cris e Elo!',
  '',
  'Seguem as credenciais de acesso ao Portal TDF. As duas usam o mesmo login (sessão única — quando uma faz login, sai a outra).',
  '',
  'URL: ' + PORTAL_URL,
  'Usuário: ' + LOGIN_USERNAME,
  'Senha: ' + LOGIN_PASSWORD,
  '',
  'Vocês têm acesso a:',
  '- 💰 BI Financeiro Multiempresa',
  '- 🗂️ CRM / Manutenção (ficha do cliente, histórico, propostas)',
  '- 📇 Contatos',
  '- 💬 Inbox WhatsApp',
  '- 🛠 Operacional',
  '- 📍 Auvo',
  '',
  'Não têm acesso a Cockpit, Admin, Gestão, comissões dos closers (restritos).',
  '',
  'Como começar: abrir o site, digitar usuário e senha, sistema abre direto no BI Financeiro.',
  '',
  'Qualquer dúvida me chamam no WhatsApp.',
  '',
  'Abraço, Paulo'
].join('\n');

(async () => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  console.log('[smtp] verificando conexão com ' + SMTP_HOST + ':' + SMTP_PORT + '...');
  try { await transporter.verify(); console.log('[smtp] conexão OK'); }
  catch(e) { console.error('[smtp] FALHA na verificação:', e.message); process.exit(2); }

  console.log('[smtp] enviando para ' + TO_EMAIL + '...');
  const info = await transporter.sendMail({
    from: 'Portal TDF <' + SMTP_USER + '>',
    to: TO_EMAIL,
    subject,
    text,
    html,
    replyTo: SMTP_USER,
  });
  console.log('[smtp] OK · messageId=' + info.messageId);
  console.log('\n✅ Email enviado para ' + TO_EMAIL);
  console.log('   Login:  ' + LOGIN_USERNAME);
  console.log('   Senha:  ' + LOGIN_PASSWORD);
  console.log('   URL:    ' + PORTAL_URL + '\n');
})().catch(e => { console.error('[smtp] ERRO:', e.message); process.exit(3); });
