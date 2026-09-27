// ============================================================================
// ENGINE GENÉRICO DE ACADEMIA DE TREINAMENTO (reutilizável por produto)
// Mesmo padrão da academia de Bebedouros, parametrizado. NÃO altera a de Bebedouros
// (que continua no seu próprio lib/treinamento-bebedouros.js).
//
// Uso (server.js):
//   app.use(base, requireAuth, require('./lib/treinamento-academia')({
//     dir, base, viewDir, progressPrefix, logTag, isGestor, USERS, kvGet, kvSet, kvAll
//   }));
//
// Formato de progresso IDÊNTICO ao da academia de Bebedouros → a Central de
// Treinamentos lê tudo do mesmo jeito pelo prefixo.
// ============================================================================
const express = require('express');
const path = require('path');

module.exports = function initAcademia(cfg) {
  const {
    dir, base, viewDir, progressPrefix, logTag = 'academia',
    isGestor, USERS = {}, kvGet, kvSet, kvAll,
  } = cfg;

  function tryRequire(p, fallback) {
    try { return require(p); } catch (e) { console.warn(`[${logTag}] faltando/erro:`, p, '-', e.message); return fallback; }
  }
  const { MODULOS, TREINAMENTO_META, moduloPorSlug } = tryRequire(path.join(dir, 'modulos.js'), { MODULOS: [], TREINAMENTO_META: {}, moduloPorSlug: () => null });
  const ROLEPLAYS = tryRequire(path.join(dir, 'roleplays.js'), { ROLEPLAYS: [] }).ROLEPLAYS || [];
  const BANCO = tryRequire(path.join(dir, 'banco-questoes.js'), { QUESTOES: [] }).QUESTOES || [];

  const _contentCache = {};
  function contentDoModulo(m) {
    if (!m || !m.contentFile) return null;
    if (_contentCache[m.contentFile] !== undefined) return _contentCache[m.contentFile];
    const c = tryRequire(path.join(dir, 'content', m.contentFile + '.js'), null);
    _contentCache[m.contentFile] = c;
    return c;
  }

  const KEY = (u) => `${progressPrefix}${u}`;
  function progressoVazio() {
    return { iniciadoEm: null, modulos: {}, roleplays: {}, prova: { tentativas: [], melhorNota: 0, aprovado: false }, certificado: null, atividades: [] };
  }

  const router = express.Router();

  const getProg = (u) => {
    const p = (kvGet && kvGet(KEY(u))) || null;
    return p ? { ...progressoVazio(), ...p, prova: { ...progressoVazio().prova, ...(p.prova || {}) } } : progressoVazio();
  };
  const setProg = async (u, p) => { try { await kvSet(KEY(u), p); } catch (e) { console.warn(`[${logTag}] setProg`, e.message); } };
  const logAtiv = (p, tipo, ref, texto) => {
    p.atividades = p.atividades || [];
    p.atividades.unshift({ tipo, ref, texto, at: new Date().toISOString() });
    p.atividades = p.atividades.slice(0, 15);
  };

  function resumo(p) {
    const total = MODULOS.length || 1;
    const concluidos = MODULOS.filter(m => p.modulos[m.slug] && p.modulos[m.slug].concluido).length;
    const pct = Math.round((concluidos / total) * 100);
    const notas = MODULOS.map(m => p.modulos[m.slug] && p.modulos[m.slug].quizNota).filter(n => typeof n === 'number');
    const notaMedia = notas.length ? Math.round(notas.reduce((a, b) => a + b, 0) / notas.length) : null;
    const roleplaysFeitos = Object.keys(p.roleplays || {}).length;
    const roleplaysObrig = (ROLEPLAYS.filter(r => r.obrigatorio).length) || 0;
    const roleplaysOk = roleplaysObrig === 0 ? true : (ROLEPLAYS.filter(r => r.obrigatorio).every(r => p.roleplays[r.id]) || roleplaysFeitos >= roleplaysObrig);
    const podeCertificar = concluidos === total && p.prova.aprovado && roleplaysOk && total > 0;
    return { total, concluidos, pct, notaMedia, roleplaysFeitos, roleplaysObrig, roleplaysOk, podeCertificar };
  }

  function baseView(req, extra) {
    const u = USERS[req.session.user.username];
    return Object.assign({
      user: req.session.user, activePage: 'treinamento',
      META: TREINAMENTO_META, MODULOS, ROLEPLAYS, base,
      isGestorView: !!(isGestor && isGestor(u)),
    }, extra || {});
  }

  // --------------------------------- HUB ----------------------------------
  router.get('/', (req, res) => {
    const p = getProg(req.session.user.username);
    const preview = {};
    for (const m of MODULOS) { const c = contentDoModulo(m); if (c && c.resumoCurto) preview[m.slug] = c.resumoCurto; }
    res.render(`${viewDir}/index`, baseView(req, { pageTitle: TREINAMENTO_META.titulo || 'Treinamento', prog: p, R: resumo(p), contentPreview: preview }));
  });

  // ----------------------------- MÓDULO -----------------------------------
  router.get('/modulo/:slug', (req, res) => {
    const m = moduloPorSlug(req.params.slug);
    if (!m) return res.redirect(base);
    const p = getProg(req.session.user.username);
    const idx = MODULOS.findIndex(x => x.slug === m.slug);
    res.render(`${viewDir}/modulo`, baseView(req, {
      pageTitle: m.titulo, mod: m, conteudo: contentDoModulo(m), prog: p, R: resumo(p),
      anterior: MODULOS[idx - 1] || null, proximo: MODULOS[idx + 1] || null,
    }));
  });

  // ----------------------------- API progresso ----------------------------
  router.get('/api/progress', (req, res) => {
    const p = getProg(req.session.user.username);
    res.json({ ok: true, prog: p, resumo: resumo(p) });
  });
  router.post('/api/modulo/:slug/concluir', async (req, res) => {
    const m = moduloPorSlug(req.params.slug);
    if (!m) return res.status(404).json({ error: 'módulo inexistente' });
    const u = req.session.user.username; const p = getProg(u);
    if (!p.iniciadoEm) p.iniciadoEm = new Date().toISOString();
    const quizNota = (req.body && typeof req.body.quizNota === 'number') ? Math.max(0, Math.min(100, req.body.quizNota)) : undefined;
    p.modulos[m.slug] = { concluido: true, at: new Date().toISOString(), quizNota };
    logAtiv(p, 'modulo', m.slug, `Concluiu "${m.titulo}"` + (quizNota != null ? ` (quiz ${quizNota}%)` : ''));
    await setProg(u, p);
    res.json({ ok: true, resumo: resumo(p) });
  });

  // ------------------------------- ROLEPLAYS ------------------------------
  router.get('/roleplay/:id', (req, res) => {
    const rp = ROLEPLAYS.find(r => String(r.id) === String(req.params.id));
    if (!rp) return res.redirect(base);
    res.render(`${viewDir}/roleplay`, baseView(req, { pageTitle: 'Roleplay — ' + rp.titulo, rp }));
  });
  router.post('/api/roleplay/:id', async (req, res) => {
    const rp = ROLEPLAYS.find(r => String(r.id) === String(req.params.id));
    if (!rp) return res.status(404).json({ error: 'roleplay inexistente' });
    const u = req.session.user.username; const p = getProg(u);
    const pontos = Math.max(0, Number(req.body && req.body.pontos) || 0);
    const max = Math.max(1, Number(req.body && req.body.max) || 1);
    p.roleplays[rp.id] = { pontos, max, at: new Date().toISOString() };
    logAtiv(p, 'roleplay', rp.id, `Roleplay "${rp.titulo}": ${pontos}/${max}`);
    await setProg(u, p);
    res.json({ ok: true, resumo: resumo(p) });
  });

  // --------------------------------- PROVA --------------------------------
  function embaralhar(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  router.get('/prova', (req, res) => {
    const n = TREINAMENTO_META.questoesProva || 30;
    const selecionadas = embaralhar(BANCO).slice(0, Math.min(n, BANCO.length)).map(q => ({
      id: q.id, tema: q.tema, tipo: q.tipo, enunciado: q.enunciado,
      opcoes: embaralhar((q.opcoes || []).map((texto, i) => ({ texto, correta: i === q.correta }))),
    }));
    const p = getProg(req.session.user.username);
    res.render(`${viewDir}/prova`, baseView(req, { pageTitle: 'Prova', questoes: selecionadas, prog: p, R: resumo(p) }));
  });
  router.post('/api/prova', async (req, res) => {
    const respostas = (req.body && req.body.respostas) || {};
    const n = TREINAMENTO_META.questoesProva || 30;
    let acertos = 0, aplicadas = 0; const porTema = {};
    for (const q of BANCO) {
      if (!(q.id in respostas)) continue;
      aplicadas++;
      const correta = (q.opcoes || [])[q.correta];
      const acertou = respostas[q.id] === correta;
      porTema[q.tema] = porTema[q.tema] || { certos: 0, total: 0 };
      porTema[q.tema].total++; if (acertou) { acertos++; porTema[q.tema].certos++; }
    }
    const totalConsiderado = Math.min(aplicadas, n) || aplicadas || 1;
    const nota = Math.round((acertos / totalConsiderado) * 100);
    const minima = TREINAMENTO_META.notaMinimaProva || 80;
    const aprovado = nota >= minima;
    const areas = Object.entries(porTema).map(([tema, v]) => ({ tema, pct: Math.round((v.certos / v.total) * 100) })).filter(a => a.pct < 100).sort((a, b) => a.pct - b.pct).slice(0, 6);
    const u = req.session.user.username; const p = getProg(u);
    p.prova.tentativas.unshift({ nota, aprovado, at: new Date().toISOString(), areas });
    p.prova.tentativas = p.prova.tentativas.slice(0, 20);
    p.prova.melhorNota = Math.max(p.prova.melhorNota || 0, nota);
    if (aprovado) p.prova.aprovado = true;
    logAtiv(p, 'prova', null, `Prova: ${nota}% ${aprovado ? '✅' : '❌'}`);
    await setProg(u, p);
    res.json({ ok: true, nota, aprovado, minima, areas, resumo: resumo(p) });
  });

  // ------------------------------ CERTIFICADO -----------------------------
  function gerarCodigo(u) { return (TREINAMENTO_META.certPrefix || 'TDF') + '-' + Buffer.from(u + '|' + Date.now()).toString('base64').replace(/[^A-Z0-9]/gi, '').slice(0, 10).toUpperCase(); }
  router.get('/certificado', async (req, res) => {
    const u = req.session.user.username; const p = getProg(u); const R = resumo(p);
    if (R.podeCertificar && !p.certificado) {
      p.certificado = { codigo: gerarCodigo(u), at: new Date().toISOString(), nota: p.prova.melhorNota, nome: (USERS[u] && (USERS[u].name || USERS[u].nome)) || req.session.user.name || req.session.user.nome || u };
      logAtiv(p, 'certificado', null, 'Certificado emitido 🎓');
      await setProg(u, p);
    }
    res.render(`${viewDir}/certificado`, baseView(req, { pageTitle: 'Certificado', prog: p, R }));
  });
  router.get('/certificado/pdf', (req, res) => {
    const u = req.session.user.username; const p = getProg(u);
    if (!p.certificado) return res.redirect(base + '/certificado');
    let PDFDocument; try { PDFDocument = require('pdfkit'); } catch (e) { return res.status(500).send('pdfkit indisponível'); }
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="certificado-${logTag}-${u}.pdf"`);
    doc.pipe(res);
    const W = doc.page.width, H = doc.page.height;
    doc.rect(0, 0, W, H).fill('#0D1117');
    doc.lineWidth(3).strokeColor('#00AAFF').rect(30, 30, W - 60, H - 60).stroke();
    doc.fillColor('#00AAFF').fontSize(14).text('TUDO DE FILTRO', 0, 70, { align: 'center' });
    doc.fillColor('#E6EDF3').fontSize(30).text('CERTIFICADO', { align: 'center' });
    doc.moveDown(0.3).fillColor('#8899AA').fontSize(13).text('Certificamos que', { align: 'center' });
    doc.moveDown(0.4).fillColor('#FFFFFF').fontSize(26).text(p.certificado.nome || u, { align: 'center' });
    doc.moveDown(0.4).fillColor('#8899AA').fontSize(13).text('concluiu com aproveitamento o treinamento', { align: 'center' });
    doc.moveDown(0.2).fillColor('#3FB950').fontSize(17).text(TREINAMENTO_META.certificado || TREINAMENTO_META.titulo || 'Treinamento', { align: 'center' });
    doc.moveDown(1).fillColor('#E6EDF3').fontSize(12).text(`Nota final: ${p.certificado.nota}%   •   Código: ${p.certificado.codigo}`, { align: 'center' });
    const dt = new Date(p.certificado.at).toLocaleDateString('pt-BR');
    doc.moveDown(0.3).fillColor('#8899AA').fontSize(11).text(`Emitido em ${dt}`, { align: 'center' });
    doc.end();
  });

  // ------------------------------ PAINEL GESTOR ---------------------------
  router.get('/gestor', (req, res) => {
    const u = USERS[req.session.user.username];
    if (!(isGestor && isGestor(u))) return res.status(403).send('Acesso restrito à gestão.');
    const all = (kvAll && kvAll()) || {};
    const linhas = [];
    for (const k of Object.keys(all)) {
      if (!k.startsWith(progressPrefix)) continue;
      const username = k.replace(progressPrefix, '');
      const p = { ...progressoVazio(), ...all[k] };
      const R = resumo(p);
      linhas.push({ username, nome: (USERS[username] && (USERS[username].name || USERS[username].nome)) || username, pct: R.pct, concluidos: R.concluidos, total: R.total, notaMedia: R.notaMedia, prova: p.prova, roleplaysFeitos: R.roleplaysFeitos, certificado: p.certificado, upsell: p.upsell || {}, ultima: (p.atividades && p.atividades[0]) || null });
    }
    linhas.sort((a, b) => b.pct - a.pct);
    const areasErro = {};
    for (const l of linhas) for (const t of (l.prova.tentativas || [])) for (const a of (t.areas || [])) { areasErro[a.tema] = areasErro[a.tema] || { soma: 0, n: 0 }; areasErro[a.tema].soma += a.pct; areasErro[a.tema].n++; }
    const areas = Object.entries(areasErro).map(([tema, v]) => ({ tema, media: Math.round(v.soma / v.n), ocorrencias: v.n })).sort((a, b) => a.media - b.media);
    res.render(`${viewDir}/gestor`, baseView(req, { pageTitle: 'Painel do Gestor', linhas, areas }));
  });

  return router;
};
