/**
 * Cliente HTTP pra tdf-ops — passa INTERNAL_API_KEY em todas as chamadas.
 */
const axios = require('axios');

const TDF_OPS_URL = process.env.TDF_OPS_URL || 'http://tdf-ops.railway.internal:8000';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || '';

async function call(method, path, body = null) {
  const url = `${TDF_OPS_URL}${path}`;
  console.log(`[tdf-ops] ${method} ${url}`);
  try {
    const res = await axios({
      method,
      url,
      data: body,
      headers: { 'X-Internal-Key': INTERNAL_API_KEY, 'Content-Type': 'application/json' },
      timeout: 10000,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    const status = err.response?.status || 0;
    const data = err.response?.data || { error: err.message };
    console.error(`[tdf-ops] ERRO ${status} em ${url}:`, JSON.stringify(data));
    return { ok: false, status, data };
  }
}

module.exports = {
  health: () => call('GET', '/health'),  // público, sem header (mas ok enviar)
  listClientes: () => call('GET', '/api/clientes'),
  createCliente: (payload) => call('POST', '/api/clientes', payload),
  listPedidos: () => call('GET', '/api/pedidos'),
  createPedido: (payload) => call('POST', '/api/pedidos', payload),
  listKanban: () => call('GET', '/api/kanban'),
  createKanban: (payload) => call('POST', '/api/kanban', payload),
  listRotas: () => call('GET', '/api/rotas'),
};
