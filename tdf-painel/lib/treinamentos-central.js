// ============================================================================
// CENTRAL DE TREINAMENTOS — visão do gestor de closer × produto
// Router isolado. Montado com 1 linha no server.js. Restrito a gestor/CEO.
// Lê o progresso de cada academia ativa direto do kv_store (catálogo define o prefixo).
//
// deps: { isGestor, USERS, kvAll()->objeto do kv_store }
// ============================================================================
const express = require('express');
const path = require('path');
const { ACADEMIAS } = require(path.join(__dirname, '..', 'data', 'treinamentos', 'catalogo.js'));

// papéis que contam como "aluno" (time comercial + pós-venda)
const ROLES_ALUNO = ['closer', 'posvenda', 'sdr', 'revendedor'];

// resume um blob de progresso de academia ativa (formato do motor de bebedouros)
function resumirProgresso(p, academia) {
  if (!p) return { iniciou: false, pct: 0, concluidos: 0, total: academia.modulosCount || 0, provaAprovada: false, certificado: false };
  const modulos = p.modulos || {};
  const concluidos = Object.values(modulos).filter(m => m && m.concluido).length;
  const total = academia.modulosCount || 0;
  const pct = total ? Math.min(100, Math.round((concluidos / total) * 100)) : 0;
  return {
    iniciou: !!p.iniciadoEm || concluidos > 0,
    pct, concluidos, total,
    provaAprovada: !!(p.prova && p.prova.aprovado),
    melhorNota: (p.prova && p.prova.melhorNota) || 0,
    certificado: !!p.certificado,
  };
}

module.exports = function initCentral(deps) {
  const { isGestor, USERS = {}, kvAll } = deps;
  const router = express.Router();

  router.get('/', (req, res) => {
    const me = USERS[req.session.user.username];
    if (!(isGestor && isGestor(me))) return res.status(403).send('Acesso restrito à gestão.');

    const kv = (kvAll && kvAll()) || {};

    // linhas = alunos (USERS do time) + qualquer username que tenha progresso mas não esteja no USERS
    const alunos = new Map(); // username -> nome
    for (const [u, info] of Object.entries(USERS)) {
      if (ROLES_ALUNO.includes(info.role)) alunos.set(u, info.name || u);
    }
    for (const acad of ACADEMIAS) {
      if (acad.status !== 'ativo') continue;
      for (const k of Object.keys(kv)) {
        if (k.startsWith(acad.progressPrefix)) {
          const u = k.slice(acad.progressPrefix.length);
          if (!alunos.has(u)) alunos.set(u, (USERS[u] && USERS[u].name) || u);
        }
      }
    }

    // matriz: para cada aluno, o resumo em cada academia ativa
    const linhas = [];
    for (const [username, nome] of alunos) {
      const celulas = ACADEMIAS.map(acad => {
        if (acad.status !== 'ativo') return { acad, ativo: false };
        const p = kv[acad.progressPrefix + username] || null;
        return { acad, ativo: true, r: resumirProgresso(p, acad) };
      });
      linhas.push({ username, nome, celulas });
    }
    linhas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    // agregados por academia (rodapé)
    const resumoAcad = ACADEMIAS.map(acad => {
      if (acad.status !== 'ativo') return { acad, ativo: false };
      let iniciaram = 0, certificados = 0, aprovados = 0, somaPct = 0, n = 0;
      for (const l of linhas) {
        const c = l.celulas.find(x => x.acad.id === acad.id);
        if (!c || !c.r) continue;
        n++; somaPct += c.r.pct;
        if (c.r.iniciou) iniciaram++;
        if (c.r.certificado) certificados++;
        if (c.r.provaAprovada) aprovados++;
      }
      return { acad, ativo: true, iniciaram, certificados, aprovados, mediaPct: n ? Math.round(somaPct / n) : 0, totalAlunos: n };
    });

    res.render('treinamento/central', {
      user: req.session.user, activePage: 'treinamento', pageTitle: 'Central de Treinamentos',
      ACADEMIAS, linhas, resumoAcad,
    });
  });

  return router;
};
