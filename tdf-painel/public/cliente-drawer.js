// public/cliente-drawer.js — Drawer de cliente compartilhado (UX #4)
// Carregado em todas as páginas via layout.ejs.
// Reusado por /closy e /manutencao (mata duplicação de código).
//
// Uso: window.abrirClienteDrawer(dealId, opcoes)
//   opcoes: { phone?, nome?, onAfterSave?(field, value) }

(function(){
  if (window.__clienteDrawerLoaded) return;
  window.__clienteDrawerLoaded = true;

  // Injeta DOM uma vez
  function _ensureDrawer() {
    if (document.getElementById('cd-drawer')) return;
    const css = document.createElement('style');
    css.textContent = `
      #cd-drawer{position:fixed;top:0;right:-560px;width:540px;max-width:100vw;height:100vh;background:#0e0e0e;border-left:1px solid #2a2a2a;z-index:300;transition:right .25s;display:flex;flex-direction:column;color:#e6edf3;overflow:hidden}
      #cd-drawer.open{right:0}
      #cd-drawer header{padding:14px 18px;border-bottom:1px solid #222;background:linear-gradient(135deg,#0d1117,#161B22);display:flex;align-items:center;gap:10px;flex-shrink:0}
      #cd-drawer header .nome{flex:1;color:#fff;font-weight:800;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #cd-drawer header button{background:#1a1a1a;border:1px solid #30363D;color:#aaa;font-size:12px;cursor:pointer;padding:5px 10px;border-radius:5px;font-weight:700}
      #cd-drawer header button.close{color:#ef4444;border-color:#ef4444}
      #cd-drawer .body{flex:1;overflow-y:auto;padding:14px 18px}
      #cd-drawer .section-title{padding:12px 0 4px;font-size:10px;color:#7cb9f5;text-transform:uppercase;letter-spacing:.5px;font-weight:800;border-bottom:1px solid #1f2937;margin-bottom:6px}
      #cd-drawer .field{padding:8px 0;border-bottom:1px solid #1a1a1a}
      #cd-drawer .field label{display:block;color:#888;font-size:9px;text-transform:uppercase;letter-spacing:.4px;font-weight:700;margin-bottom:4px}
      #cd-drawer .field label .target{color:#666;font-size:8px;margin-left:6px;text-transform:none;letter-spacing:0;font-style:italic}
      #cd-drawer .field input,#cd-drawer .field select,#cd-drawer .field textarea{width:100%;background:#161616;border:1px solid #30363D;color:#fff;border-radius:5px;padding:7px 9px;font-size:12px;font-family:inherit}
      #cd-drawer .field textarea{resize:vertical;min-height:50px}
      #cd-drawer .field .actions{display:flex;gap:6px;align-items:center;margin-top:5px}
      #cd-drawer .field .save{background:#22c55e;color:#000;border:none;border-radius:4px;padding:4px 10px;font-size:10px;font-weight:800;cursor:pointer}
      #cd-drawer .field .ok{color:#22c55e;font-size:10px;font-weight:700}
      #cd-drawer .field .err{color:#ef4444;font-size:10px;font-weight:700}
      #cd-drawer .acts{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:14px}
      #cd-drawer .acts a,#cd-drawer .acts button{padding:8px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;text-align:center;border:1px solid;cursor:pointer;background:transparent}
    `;
    document.head.appendChild(css);
    const d = document.createElement('div');
    d.id = 'cd-drawer';
    d.innerHTML = `
      <header>
        <span class="nome" id="cd-nome">—</span>
        <a id="cd-crm-link" href="#" target="_blank" title="Abrir no Zoho CRM" style="background:#1f6feb;color:#fff;border:none;border-radius:5px;padding:5px 10px;font-size:11px;font-weight:700;text-decoration:none">📂 CRM</a>
        <a id="cd-wati-link" href="#" target="_blank" title="Abrir conversa WATI" style="background:#25D366;color:#fff;border:none;border-radius:5px;padding:5px 10px;font-size:11px;font-weight:700;text-decoration:none">💬 WATI</a>
        <button class="close" onclick="window.fecharClienteDrawer()" title="Fechar">✕</button>
      </header>
      <div class="body" id="cd-body"></div>
    `;
    document.body.appendChild(d);
  }

  let _CD_FIELDS = null;
  let _CD_CUSTOM = null;
  let _CD_PRODS = null;
  let _CD_OPCOES = {};

  async function _carregarFields(){
    if (_CD_FIELDS) return _CD_FIELDS;
    try {
      const r = await fetch('/closy/fields');
      const d = await r.json();
      _CD_FIELDS = d.fields || {};
    } catch(_) { _CD_FIELDS = {}; }
    return _CD_FIELDS;
  }
  async function _carregarCustomFields(){
    if (_CD_CUSTOM) return _CD_CUSTOM;
    try {
      const r = await fetch('/closy/custom-fields');
      const d = await r.json();
      _CD_CUSTOM = d.fields || [];
    } catch(_) { _CD_CUSTOM = []; }
    return _CD_CUSTOM;
  }
  async function _carregarProdutos(){
    if (_CD_PRODS) return _CD_PRODS;
    try {
      const r = await fetch('/closy/produtos');
      const d = await r.json();
      _CD_PRODS = (d.produtos || []).filter(p => p.ativo !== false);
    } catch(_) { _CD_PRODS = []; }
    return _CD_PRODS;
  }

  window.abrirClienteDrawer = async function(dealId, opcoes){
    _CD_OPCOES = opcoes || {};
    _ensureDrawer();
    const drawer = document.getElementById('cd-drawer');
    drawer.classList.add('open');
    document.getElementById('cd-body').innerHTML = '<div style="color:#888;text-align:center;padding:30px;font-size:12px">⏳ Carregando...</div>';
    document.getElementById('cd-nome').textContent = opcoes?.nome || dealId;
    if (dealId && !String(dealId).startsWith('erp:') && !String(dealId).startsWith('wati:')) {
      document.getElementById('cd-crm-link').href = `https://crmplus.zoho.com/tudodefiltro3711/index.do/cxapp/crm/org856385701/tab/Potentials/${dealId}`;
    }
    if (opcoes?.phone) {
      document.getElementById('cd-wati-link').href = `https://live-2708.wati.io/2708/teamInbox/${String(opcoes.phone).replace(/\D/g,'')}`;
    }

    // Carrega tudo em paralelo
    const [fields, custom, prods, info] = await Promise.all([
      _carregarFields(),
      _carregarCustomFields(),
      _carregarProdutos(),
      fetch('/manutencao/cliente-info/' + dealId).then(r => r.json()).catch(() => ({})),
    ]);

    const cliente = info.cliente || {};
    document.getElementById('cd-nome').textContent = cliente.nome || opcoes?.nome || dealId;
    if (cliente.telefone) document.getElementById('cd-wati-link').href = `https://live-2708.wati.io/2708/teamInbox/${String(cliente.telefone).replace(/\D/g,'')}`;

    const valores = {
      Stage: cliente.stage || '',
      Amount: cliente.valor || 0,
      Tier_Lead: cliente.tier || '',
      Cidade: cliente.cidade || '',
      Lead_Source: cliente.leadSource || '',
      Produto_Vendido: cliente.produto || '',
      Closing_Date: '',
      Telefone_contato: cliente.telefone || '',
      Email: cliente.email || '',
      Description: cliente.description || '',
      observacao: info.observacao || '',
      precoManutencao: info.precoManutencao || '',
      cep: info.cep || '',
      ultimaManutencao: info.ultimaManutencao || '',
      produtoId: info.produtoId || '',
    };

    function fieldHtml(key, cfg){
      const v = valores[key] != null ? valores[key] : '';
      let input;
      if (cfg.tipo === 'enum') {
        if (cfg.dynamicOptions === 'produtos') {
          input = `<select id="cd-fld-${key}"><option value="">— sem produto —</option>${prods.map(p => `<option value="${p.id}" ${v===p.id?'selected':''}>${p.nome} · ${p.vidaUtilMeses}m</option>`).join('')}</select>`;
        } else {
          const opts = cfg.options || [];
          input = `<select id="cd-fld-${key}">${opts.map(o => `<option value="${o}" ${v===o?'selected':''}>${o}</option>`).join('')}</select>`;
        }
      } else if (cfg.tipo === 'textarea') {
        input = `<textarea id="cd-fld-${key}">${(v||'').toString().replace(/</g,'&lt;')}</textarea>`;
      } else if (cfg.tipo === 'number') {
        input = `<input id="cd-fld-${key}" type="number" min="0" step="0.01" value="${v||''}">`;
      } else if (cfg.tipo === 'date') {
        input = `<input id="cd-fld-${key}" type="date" value="${v||''}">`;
      } else if (cfg.tipo === 'email') {
        input = `<input id="cd-fld-${key}" type="email" value="${(v||'').toString().replace(/"/g,'&quot;')}">`;
      } else {
        input = `<input id="cd-fld-${key}" type="text" value="${(v||'').toString().replace(/"/g,'&quot;')}">`;
      }
      const targetLbl = cfg.target === 'closy' ? '· Closy local' : '· Zoho';
      return `<div class="field" data-field="${key}"><label>${cfg.label}<span class="target">${targetLbl}</span></label>${input}<div class="actions"><button class="save" onclick="window._cdSalvarCampo('${dealId}','${key}')">💾 Salvar</button><span id="cd-status-${key}"></span></div></div>`;
    }

    const zohoFields = Object.entries(fields).filter(([k,v]) => v.target === 'zoho');
    const closyFields = Object.entries(fields).filter(([k,v]) => v.target === 'closy');
    const customNonMedd = custom.filter(f => !String(f.id).startsWith('cf_meddpicc_'));
    const meddpicc = custom.filter(f => String(f.id).startsWith('cf_meddpicc_'));

    let html = '<div class="section-title">📂 Zoho CRM</div>' + zohoFields.map(([k,cfg]) => fieldHtml(k,cfg)).join('');
    html += '<div class="section-title">🏠 Closy local</div>' + closyFields.map(([k,cfg]) => fieldHtml(k,cfg)).join('');
    if (meddpicc.length) {
      const customValues = info.customFields || {};
      const preenchidos = meddpicc.filter(f => customValues[f.id] && String(customValues[f.id]).trim()).length;
      const total = meddpicc.length;
      const pct = Math.round((preenchidos / total) * 100);
      const cor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
      html += `<div class="section-title" style="display:flex;align-items:center;gap:8px">🎯 MEDDPICC <span style="background:${cor}22;color:${cor};border:1px solid ${cor};padding:2px 8px;border-radius:8px;font-size:9px;font-weight:800">${preenchidos}/${total} · ${pct}%</span></div>`;
      meddpicc.forEach(cf => { html += _customFieldHtml(cf, customValues, dealId); });
    }
    if (customNonMedd.length) {
      const customValues = info.customFields || {};
      html += '<div class="section-title">🏷️ Campos personalizados</div>';
      customNonMedd.forEach(cf => { html += _customFieldHtml(cf, customValues, dealId); });
    }
    html += '<div class="acts"><a href="/manutencao#'+dealId+'" style="color:#7cb9f5;border-color:#1f6feb">📋 Ver no CRM Closy</a><a href="/closy/custom-fields-page" target="_blank" style="color:#a371f7;border-color:#7c3aed">⚙️ Campos custom</a></div>';

    document.getElementById('cd-body').innerHTML = html;
  };

  function _customFieldHtml(cf, customValues, dealId){
    const v = customValues[cf.id] != null ? customValues[cf.id] : '';
    let input;
    if (cf.tipo === 'enum') {
      input = `<select id="cd-cf-${cf.id}"><option value="">—</option>${(cf.options||[]).map(o => `<option value="${o}" ${v===o?'selected':''}>${o}</option>`).join('')}</select>`;
    } else if (cf.tipo === 'textarea') {
      input = `<textarea id="cd-cf-${cf.id}">${(v||'').toString().replace(/</g,'&lt;')}</textarea>`;
    } else if (cf.tipo === 'number') {
      input = `<input id="cd-cf-${cf.id}" type="number" step="any" value="${v||''}">`;
    } else if (cf.tipo === 'date') {
      input = `<input id="cd-cf-${cf.id}" type="date" value="${(v||'').toString().slice(0,10)}">`;
    } else if (cf.tipo === 'bool') {
      input = `<select id="cd-cf-${cf.id}"><option value="">—</option><option value="true" ${v===true||v==='true'?'selected':''}>Sim</option><option value="false" ${v===false||v==='false'?'selected':''}>Não</option></select>`;
    } else {
      input = `<input id="cd-cf-${cf.id}" type="text" value="${(v||'').toString().replace(/"/g,'&quot;')}">`;
    }
    const req = cf.required ? ' <span style="color:#fbbf24">*</span>' : '';
    return `<div class="field" data-custom="${cf.id}"><label>${cf.label}${req} <span class="target">· Closy custom</span></label>${input}<div class="actions"><button class="save" onclick="window._cdSalvarCustom('${dealId}','${cf.id}','${cf.tipo}')">💾</button><span id="cd-cfs-${cf.id}"></span></div></div>`;
  }

  window._cdSalvarCampo = async function(dealId, fieldName){
    const el = document.getElementById('cd-fld-' + fieldName);
    if (!el) return;
    const value = el.value;
    const status = document.getElementById('cd-status-' + fieldName);
    status.className = ''; status.textContent = '⏳';
    try {
      const r = await fetch(`/closy/deals/${dealId}/field/${fieldName}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ value }) });
      const d = await r.json();
      if (d.error) { status.className = 'err'; status.textContent = '❌'; return; }
      status.className = 'ok'; status.textContent = '✅';
      setTimeout(() => { status.textContent = ''; }, 1800);
      if (_CD_OPCOES.onAfterSave) try { _CD_OPCOES.onAfterSave(fieldName, value); } catch(_){}
    } catch(e) { status.className = 'err'; status.textContent = '❌ ' + e.message; }
  };

  window._cdSalvarCustom = async function(dealId, fieldId, tipo){
    const el = document.getElementById('cd-cf-' + fieldId);
    if (!el) return;
    let value = el.value;
    if (tipo === 'number') value = Number(value) || 0;
    else if (tipo === 'bool') value = value === 'true';
    const status = document.getElementById('cd-cfs-' + fieldId);
    status.className = ''; status.textContent = '⏳';
    try {
      const r = await fetch(`/closy/deals/${dealId}/custom/${fieldId}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ value }) });
      const d = await r.json();
      if (d.error) { status.className = 'err'; status.textContent = '❌'; return; }
      status.className = 'ok'; status.textContent = '✅';
      setTimeout(() => { status.textContent = ''; }, 1800);
    } catch(e) { status.className = 'err'; status.textContent = '❌ ' + e.message; }
  };

  window.fecharClienteDrawer = function(){
    const d = document.getElementById('cd-drawer');
    if (d) d.classList.remove('open');
  };
})();
