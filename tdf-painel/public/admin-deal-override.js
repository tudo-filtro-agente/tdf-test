// === Admin Deal Override (shared) ===
// Botão e modal pra reclassificar venda e trocar vendedor (apenas admin).
// Persiste em Postgres (tabela deal_overrides) via /admin/deals/:id/override.
// Importado pelo layout.ejs — disponível em todas as views.

(function() {
  if (window.__admDealOverrideLoaded) return;
  window.__admDealOverrideLoaded = true;

  // IS_ADMIN deve ser setado pelo EJS antes deste script carregar:
  //   <script>window.IS_ADMIN = '<%= user.role %>' === 'admin';</script>
  // Se não setado, ninguém vê os botões.

  var _vendCache = null;

  window.admBtnHTML = function(dealId, dealName, currentCat, currentVend) {
    if (!window.IS_ADMIN) return '';
    var safeName = (dealName || '').replace(/['"\\]/g, '');
    var safeCat = (currentCat || '').replace(/['"\\]/g, '');
    var safeVend = (currentVend || '').replace(/['"\\]/g, '');
    return '<button onclick="event.stopPropagation();admMenu(\'' + dealId + '\',\'' + safeName + '\',\'' + safeCat + '\',\'' + safeVend + '\')" title="Admin: reclassificar produto / trocar vendedor" style="color:#fbbf24;border:1px solid #fbbf24;border-radius:5px;padding:3px 8px;font-size:10px;font-weight:800;cursor:pointer;background:rgba(251,191,36,.06)">⚙️ Admin</button>';
  };

  window.admMenu = async function(dealId, dealName, currentCat, currentVend) {
    if (!window.IS_ADMIN) return;
    if (!_vendCache) {
      try {
        var r = await fetch('/admin/vendedores');
        var d = await r.json();
        _vendCache = d.vendedores || [];
      } catch(e) { alert('Erro carregando vendedores: '+e.message); return; }
    }
    var cats = ['filtro_entrada','bebedouro','refil','elemento_filtrante','iron_free','scale_stop','purificador','condominio','loja','outros'];
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML =
      '<div style="background:#0d1117;border:2px solid #fbbf24;border-radius:12px;padding:24px;max-width:480px;width:100%;color:#e6edf3;font-family:inherit">' +
        '<h3 style="margin:0 0 4px;color:#fbbf24;font-size:16px">⚙️ Reclassificar venda</h3>' +
        '<div style="font-size:11px;color:#888;margin-bottom:16px;word-break:break-word">'+(dealName||'?')+' (id: '+dealId+')</div>' +
        '<label style="display:block;font-size:11px;color:#aaa;text-transform:uppercase;font-weight:700;margin-bottom:4px">Nova categoria (visual, não muda no Zoho)</label>' +
        '<select id="adm-cat" style="width:100%;padding:9px 11px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:13px;margin-bottom:14px">' +
          '<option value="">— manter categoria atual ('+(currentCat||'?')+') —</option>' +
          cats.map(function(c){ return '<option value="'+c+'" '+(c===currentCat?'selected':'')+'>'+c+'</option>'; }).join('') +
        '</select>' +
        '<label style="display:block;font-size:11px;color:#aaa;text-transform:uppercase;font-weight:700;margin-bottom:4px">Trocar vendedor (visual, não muda no Zoho)</label>' +
        '<select id="adm-vend" style="width:100%;padding:9px 11px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:13px;margin-bottom:14px">' +
          '<option value="">— manter vendedor atual ('+(currentVend||'?')+') —</option>' +
          _vendCache.map(function(v){ return '<option value="'+v.username+'">'+v.name+' ('+(v.team||'?')+')</option>'; }).join('') +
        '</select>' +
        '<label style="display:block;font-size:11px;color:#aaa;text-transform:uppercase;font-weight:700;margin-bottom:4px">Motivo (opcional)</label>' +
        '<input type="text" id="adm-reason" placeholder="ex: classificação errada do Zoho" style="width:100%;padding:9px 11px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:13px;margin-bottom:18px">' +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
          '<button id="adm-clear" style="background:transparent;color:#ef4444;border:1px solid #ef4444;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer">Limpar override</button>' +
          '<button id="adm-cancel" style="background:#1a1a1a;color:#aaa;border:1px solid #30363d;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer">Cancelar</button>' +
          '<button id="adm-save" style="background:#fbbf24;color:#000;border:none;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:800;cursor:pointer">Salvar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    var close = function(){ overlay.remove(); };
    overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
    overlay.querySelector('#adm-cancel').onclick = close;
    overlay.querySelector('#adm-clear').onclick = async function(){
      if (!confirm('Remover TODOS os overrides desse deal?')) return;
      try {
        var r = await fetch('/admin/deals/'+encodeURIComponent(dealId)+'/override', { method:'DELETE' });
        var d = await r.json();
        if (d.error) throw new Error(d.error);
        close(); alert('✓ Override removido. Recarregue a tela.');
      } catch(e) { alert('Erro: '+e.message); }
    };
    overlay.querySelector('#adm-save').onclick = async function(){
      var category = overlay.querySelector('#adm-cat').value;
      var vendedorUsername = overlay.querySelector('#adm-vend').value;
      var reason = overlay.querySelector('#adm-reason').value;
      if (!category && !vendedorUsername) { alert('Escolha pelo menos categoria ou vendedor.'); return; }
      try {
        var r = await fetch('/admin/deals/'+encodeURIComponent(dealId)+'/override', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ category: category, vendedorUsername: vendedorUsername, reason: reason })
        });
        var d = await r.json();
        if (d.error) throw new Error(d.error);
        close(); alert('✓ Override salvo. Recarregue a tela pra ver mudanças.');
      } catch(e) { alert('Erro: '+e.message); }
    };
  };
})();
