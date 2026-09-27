// ============================================================================
// MÓDULO: Treinamento de Vendas — Bebedouros Industriais
// Router Express isolado. Montado em server.js com UMA linha (app.use).
// Persistência: camada kv_store existente do portal (Postgres + cache) — sobrevive redeploy.
//
// deps esperadas (injetadas pelo server.js):
//   { isGestor, USERS, kvGet(key)->value, kvSet(key,value)->Promise, kvAll()->objeto }
// ============================================================================
const express = require('express');
const path = require('path');
const DIR = path.join(__dirname, '..', 'data', 'treinamento-bebedouros');

// ---- carga defensiva dos dados (se um arquivo de conteúdo faltar, não derruba o portal) ----
function tryRequire(p, fallback) {
  try { return require(p); } catch (e) { console.warn('[trein-beb] faltando/erro:', p, '-', e.message); return fallback; }
}
const { MODULOS, TREINAMENTO_META, moduloPorSlug } = tryRequire(path.join(DIR, 'modulos.js'), { MODULOS: [], TREINAMENTO_META: {}, moduloPorSlug: () => null });
const { PRODUTOS, COMPONENTES_COMUNS, REGRAS_TORNEIRA } = tryRequire(path.join(DIR, 'produtos.js'), { PRODUTOS: [], COMPONENTES_COMUNS: {}, REGRAS_TORNEIRA: {} });
const { BEBEDOUROS, UPSELL_REFIL, brl, precoDoModelo } = tryRequire(path.join(DIR, 'precos.js'), { BEBEDOUROS: [], UPSELL_REFIL: {}, brl: v => 'R$ ' + v, precoDoModelo: () => null });
const { ANATOMIA } = tryRequire(path.join(DIR, 'anatomia.js'), { ANATOMIA: { componentes: [] } });
// ICP / personas / objeções ficam embutidos no conteúdo dos módulos 7, 8 e 16 (não há arquivo de dados separado).
const ROLEPLAYS = tryRequire(path.join(DIR, 'roleplays.js'), { ROLEPLAYS: [] }).ROLEPLAYS || [];
const SCRIPT_VENDA = tryRequire(path.join(DIR, 'script-venda.js'), null); // roteiro de venda WhatsApp+ligação
const PLAYBOOK = tryRequire(path.join(DIR, 'playbook.js'), null);         // Playbook Prático do Closer
const PROVA_PRATICA = tryRequire(path.join(DIR, 'prova-pratica.js'), { ETAPAS: [] }); // prova prática 3 etapas
const BANCO = tryRequire(path.join(DIR, 'banco-questoes.js'), { QUESTOES: [] }).QUESTOES || [];

// conteúdo rico de cada módulo, carregado sob demanda + cache
const _contentCache = {};
function contentDoModulo(m) {
  if (!m || !m.contentFile) return null;
  if (_contentCache[m.contentFile] !== undefined) return _contentCache[m.contentFile];
  const c = tryRequire(path.join(DIR, 'content', m.contentFile + '.js'), null);
  _contentCache[m.contentFile] = c;
  return c;
}

// ------------------------------- Progresso --------------------------------
const KEY = (u) => `treinbeb:progress:${u}`;
function progressoVazio() {
  return {
    iniciadoEm: null,
    modulos: {},         // slug -> { concluido:true, at, quizNota }
    roleplays: {},       // id   -> { pontos, max, at }
    upsell: { apresentado: 0, aceito: 0, recusado: 0 },
    prova: { tentativas: [], melhorNota: 0, aprovado: false },
    provaPratica: { tentativas: [], melhorNota: 0, aprovado: false },
    certificado: null,   // { codigo, at, nota, nome }
    atividades: [],      // log recente [{ tipo, ref, texto, at }]
  };
}

module.exports = function initTreinamentoBebedouros(deps) {
  const { isGestor, USERS = {}, kvGet, kvSet, kvAll } = deps;
  const router = express.Router();

  const getProg = (u) => {
    const p = (kvGet && kvGet(KEY(u))) || null;
    return p ? { ...progressoVazio(), ...p, upsell: { ...progressoVazio().upsell, ...(p.upsell || {}) }, prova: { ...progressoVazio().prova, ...(p.prova || {}) }, provaPratica: { ...progressoVazio().provaPratica, ...(p.provaPratica || {}) } } : progressoVazio();
  };
  const setProg = async (u, p) => { try { await kvSet(KEY(u), p); } catch (e) { console.warn('[trein-beb] setProg', e.message); } };
  const logAtiv = (p, tipo, ref, texto) => {
    p.atividades = p.atividades || [];
    p.atividades.unshift({ tipo, ref, texto, at: new Date().toISOString() });
    p.atividades = p.atividades.slice(0, 15);
  };

  // resumo calculado (usado no hub, dashboard e certificado)
  function resumo(p) {
    const total = MODULOS.length || 1;
    const concluidos = MODULOS.filter(m => p.modulos[m.slug] && p.modulos[m.slug].concluido).length;
    const pct = Math.round((concluidos / total) * 100);
    const notas = MODULOS.map(m => p.modulos[m.slug] && p.modulos[m.slug].quizNota).filter(n => typeof n === 'number');
    const notaMedia = notas.length ? Math.round(notas.reduce((a, b) => a + b, 0) / notas.length) : null;
    const roleplaysFeitos = Object.keys(p.roleplays || {}).length;
    const roleplaysObrig = (ROLEPLAYS.filter(r => r.obrigatorio).length) || ROLEPLAYS.length || 0;
    const roleplaysOk = roleplaysObrig === 0 ? true : (ROLEPLAYS.filter(r => r.obrigatorio).every(r => p.roleplays[r.id]) || roleplaysFeitos >= roleplaysObrig);
    const temPratica = ((PROVA_PRATICA && PROVA_PRATICA.ETAPAS) || []).length > 0;
    const provaPraticaOk = !!(p.provaPratica && p.provaPratica.aprovado);
    const podeCertificar = concluidos === total && p.prova.aprovado && roleplaysOk && (!temPratica || provaPraticaOk) && total > 0;
    return { total, concluidos, pct, notaMedia, roleplaysFeitos, roleplaysObrig, roleplaysOk, temPratica, provaPraticaOk, podeCertificar };
  }

  // preview curto de cada módulo (resumoCurto) — para os cards do hub
  let _preview = null;
  function contentPreview() {
    if (_preview) return _preview;
    _preview = {};
    for (const m of MODULOS) { const c = contentDoModulo(m); if (c && c.resumoCurto) _preview[m.slug] = c.resumoCurto; }
    return _preview;
  }

  // dados comuns passados a toda view
  function baseView(req, extra) {
    const u = USERS[req.session.user.username];
    return Object.assign({
      user: req.session.user,
      activePage: 'treinamento',
      META: TREINAMENTO_META, MODULOS, PRODUTOS, COMPONENTES_COMUNS, REGRAS_TORNEIRA,
      BEBEDOUROS, UPSELL_REFIL, brl, ANATOMIA, ROLEPLAYS,
      base: '/treinamento/bebedouros',
      isGestorView: !!(isGestor && isGestor(u)),
      contentPreview: contentPreview(),
    }, extra || {});
  }

  // --------------------------------- HUB ----------------------------------
  router.get('/', (req, res) => {
    const u = req.session.user.username;
    const p = getProg(u);
    res.render('treinamento/bebedouros/index', baseView(req, {
      pageTitle: 'Bebedouros Industriais', prog: p, R: resumo(p),
    }));
  });

  // ----------------------------- MÓDULO (viewer) --------------------------
  router.get('/modulo/:slug', (req, res) => {
    const m = moduloPorSlug(req.params.slug);
    if (!m) return res.redirect('/treinamento/bebedouros');
    const u = req.session.user.username;
    const p = getProg(u);
    const idx = MODULOS.findIndex(x => x.slug === m.slug);
    res.render('treinamento/bebedouros/modulo', baseView(req, {
      pageTitle: m.titulo, mod: m, conteudo: contentDoModulo(m), prog: p, R: resumo(p),
      anterior: MODULOS[idx - 1] || null, proximo: MODULOS[idx + 1] || null,
    }));
  });

  // --------------------------- SCRIPT DE VENDA ----------------------------
  router.get('/script', (req, res) => {
    res.render('treinamento/bebedouros/script', baseView(req, {
      pageTitle: 'Script de Venda', SCRIPT: SCRIPT_VENDA,
    }));
  });

  // ------------------------ PLAYBOOK PRÁTICO DO CLOSER --------------------
  router.get('/playbook', (req, res) => {
    const p = getProg(req.session.user.username);
    res.render('treinamento/bebedouros/playbook', baseView(req, {
      pageTitle: 'Playbook Prático do Closer', PB: PLAYBOOK, prog: p, R: resumo(p),
    }));
  });

  // ------------------------------ PROVA PRÁTICA ---------------------------
  router.get('/prova-pratica', (req, res) => {
    const p = getProg(req.session.user.username);
    res.render('treinamento/bebedouros/prova-pratica', baseView(req, {
      pageTitle: 'Prova Prática do Closer', PP: PROVA_PRATICA, prog: p, R: resumo(p),
    }));
  });
  router.post('/api/prova-pratica', async (req, res) => {
    const pontos = Math.max(0, Number(req.body && req.body.pontos) || 0);
    const max = Math.max(1, Number(req.body && req.body.max) || 1);
    const nota = Math.round((pontos / max) * 100);
    const minima = (PROVA_PRATICA && PROVA_PRATICA.notaMinima) || 85;
    const aprovado = nota >= minima;
    const u = req.session.user.username; const p = getProg(u);
    p.provaPratica.tentativas.unshift({ nota, aprovado, at: new Date().toISOString() });
    p.provaPratica.tentativas = p.provaPratica.tentativas.slice(0, 20);
    p.provaPratica.melhorNota = Math.max(p.provaPratica.melhorNota || 0, nota);
    if (aprovado) p.provaPratica.aprovado = true;
    logAtiv(p, 'prova-pratica', null, `Prova prática: ${nota}% ${aprovado ? '✅' : '❌'}`);
    await setProg(u, p);
    res.json({ ok: true, nota, aprovado, minima, resumo: resumo(p) });
  });

  // ----------------------------- API progresso ----------------------------
  router.get('/api/progress', (req, res) => {
    const p = getProg(req.session.user.username);
    res.json({ ok: true, prog: p, resumo: resumo(p) });
  });

  // concluir módulo (+ nota do quiz rápido opcional)
  router.post('/api/modulo/:slug/concluir', async (req, res) => {
    const m = moduloPorSlug(req.params.slug);
    if (!m) return res.status(404).json({ error: 'módulo inexistente' });
    const u = req.session.user.username;
    const p = getProg(u);
    if (!p.iniciadoEm) p.iniciadoEm = new Date().toISOString();
    const quizNota = (req.body && typeof req.body.quizNota === 'number') ? Math.max(0, Math.min(100, req.body.quizNota)) : undefined;
    p.modulos[m.slug] = { concluido: true, at: new Date().toISOString(), quizNota: quizNota };
    logAtiv(p, 'modulo', m.slug, `Concluiu "${m.titulo}"` + (quizNota != null ? ` (quiz ${quizNota}%)` : ''));
    await setProg(u, p);
    res.json({ ok: true, resumo: resumo(p) });
  });

  // registrar interação de upsell (apresentado/aceito/recusado)
  router.post('/api/upsell', async (req, res) => {
    const u = req.session.user.username; const p = getProg(u);
    const acao = (req.body && req.body.acao) || '';
    if (['apresentado', 'aceito', 'recusado'].includes(acao)) { p.upsell[acao] = (p.upsell[acao] || 0) + 1; await setProg(u, p); }
    res.json({ ok: true, upsell: p.upsell });
  });

  // ------------------------------- ROLEPLAYS ------------------------------
  router.get('/roleplay/:id', (req, res) => {
    const rp = ROLEPLAYS.find(r => String(r.id) === String(req.params.id));
    if (!rp) return res.redirect('/treinamento/bebedouros');
    res.render('treinamento/bebedouros/roleplay', baseView(req, { pageTitle: 'Roleplay — ' + rp.titulo, rp }));
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
  function embaralhar(arr) { // Fisher–Yates
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  router.get('/prova', (req, res) => {
    const n = TREINAMENTO_META.questoesProva || 30;
    const selecionadas = embaralhar(BANCO).slice(0, Math.min(n, BANCO.length)).map(q => ({
      id: q.id, tema: q.tema, tipo: q.tipo, enunciado: q.enunciado,
      // embaralha as opções mantendo o índice correto rastreável por conteúdo
      opcoes: embaralhar((q.opcoes || []).map((texto, i) => ({ texto, correta: i === q.correta }))),
    }));
    const p = getProg(req.session.user.username);
    res.render('treinamento/bebedouros/prova', baseView(req, { pageTitle: 'Prova do Closer', questoes: selecionadas, prog: p, R: resumo(p) }));
  });
  // correção server-side (não confia no cliente)
  router.post('/api/prova', async (req, res) => {
    const respostas = (req.body && req.body.respostas) || {}; // { questaoId: textoEscolhido }
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
    // áreas de dificuldade (temas com pior aproveitamento)
    const areas = Object.entries(porTema).map(([tema, v]) => ({ tema, pct: Math.round((v.certos / v.total) * 100) }))
      .filter(a => a.pct < 100).sort((a, b) => a.pct - b.pct).slice(0, 5);
    const u = req.session.user.username; const p = getProg(u);
    p.prova.tentativas.unshift({ nota, aprovado, at: new Date().toISOString(), areas });
    p.prova.tentativas = p.prova.tentativas.slice(0, 20);
    p.prova.melhorNota = Math.max(p.prova.melhorNota || 0, nota);
    if (aprovado) p.prova.aprovado = true;
    logAtiv(p, 'prova', null, `Prova: ${nota}% ${aprovado ? '✅ aprovado' : '❌'}`);
    await setProg(u, p);
    res.json({ ok: true, nota, aprovado, minima, areas, resumo: resumo(p) });
  });

  // ------------------------------ CERTIFICADO -----------------------------
  function gerarCodigo(u) { return 'TDF-BEB-' + Buffer.from(u + '|' + Date.now()).toString('base64').replace(/[^A-Z0-9]/gi, '').slice(0, 10).toUpperCase(); }
  router.get('/certificado', async (req, res) => {
    const u = req.session.user.username; const p = getProg(u); const R = resumo(p);
    if (R.podeCertificar && !p.certificado) {
      p.certificado = { codigo: gerarCodigo(u), at: new Date().toISOString(), nota: p.prova.melhorNota, nome: (USERS[u] && (USERS[u].name || USERS[u].nome)) || req.session.user.name || req.session.user.nome || u };
      logAtiv(p, 'certificado', null, 'Certificado emitido 🎓');
      await setProg(u, p);
    }
    res.render('treinamento/bebedouros/certificado', baseView(req, { pageTitle: 'Certificado', prog: p, R }));
  });
  // PDF do certificado (pdfkit já é dependência do portal)
  router.get('/certificado/pdf', (req, res) => {
    const u = req.session.user.username; const p = getProg(u);
    if (!p.certificado) return res.redirect('/treinamento/bebedouros/certificado');
    let PDFDocument; try { PDFDocument = require('pdfkit'); } catch (e) { return res.status(500).send('pdfkit indisponível'); }
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="certificado-bebedouros-${u}.pdf"`);
    doc.pipe(res);
    const W = doc.page.width, H = doc.page.height;
    doc.rect(0, 0, W, H).fill('#0D1117');
    doc.lineWidth(3).strokeColor('#00AAFF').rect(30, 30, W - 60, H - 60).stroke();
    doc.fillColor('#00AAFF').fontSize(14).text('TUDO DE FILTRO', 0, 70, { align: 'center' });
    doc.fillColor('#E6EDF3').fontSize(30).text('CERTIFICADO', { align: 'center' });
    doc.moveDown(0.3).fillColor('#8899AA').fontSize(13).text('Certificamos que', { align: 'center' });
    doc.moveDown(0.4).fillColor('#FFFFFF').fontSize(26).text(p.certificado.nome || u, { align: 'center' });
    doc.moveDown(0.4).fillColor('#8899AA').fontSize(13).text('concluiu com aproveitamento o treinamento', { align: 'center' });
    doc.moveDown(0.2).fillColor('#3FB950').fontSize(18).text('Closer Certificado em Bebedouros Industriais', { align: 'center' });
    doc.moveDown(1).fillColor('#E6EDF3').fontSize(12)
      .text(`Nota final: ${p.certificado.nota}%   •   Código: ${p.certificado.codigo}`, { align: 'center' });
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
      if (!k.startsWith('treinbeb:progress:')) continue;
      const username = k.replace('treinbeb:progress:', '');
      const p = { ...progressoVazio(), ...all[k] };
      const R = resumo(p);
      linhas.push({
        username, nome: (USERS[username] && (USERS[username].name || USERS[username].nome)) || username,
        pct: R.pct, concluidos: R.concluidos, total: R.total, notaMedia: R.notaMedia,
        prova: p.prova, roleplaysFeitos: R.roleplaysFeitos, certificado: p.certificado,
        upsell: p.upsell, ultima: (p.atividades && p.atividades[0]) || null,
      });
    }
    linhas.sort((a, b) => b.pct - a.pct);
    // agregados de erro por área (das tentativas de prova)
    const areasErro = {};
    for (const l of linhas) for (const t of (l.prova.tentativas || [])) for (const a of (t.areas || [])) {
      areasErro[a.tema] = areasErro[a.tema] || { soma: 0, n: 0 }; areasErro[a.tema].soma += a.pct; areasErro[a.tema].n++;
    }
    const areas = Object.entries(areasErro).map(([tema, v]) => ({ tema, media: Math.round(v.soma / v.n), ocorrencias: v.n })).sort((a, b) => a.media - b.media);
    res.render('treinamento/bebedouros/gestor', baseView(req, { pageTitle: 'Painel do Gestor', linhas, areas }));
  });

  return router;
};
