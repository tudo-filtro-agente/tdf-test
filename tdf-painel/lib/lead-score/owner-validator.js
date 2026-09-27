/**
 * Lead Score — Owner Validator.
 *
 * Valida se um Owner do Zoho pode receber tasks/calls de um determinado produto.
 *
 * Estratégia de permissões:
 *   1. USERS pode ter `permissoes: { bebedouro:bool, filtro_entrada:bool, poco:bool, iron_free:bool, scale_stop:bool, purificador:bool, refil:bool }`
 *   2. Se `permissoes` não existir, infere conservadoramente pelo `team`:
 *        team='bebedouro' → só pode_receber_bebedouro
 *        team='poco'      → pode poco, iron_free, scale_stop (água não tratada)
 *        team='filtro'    → pode filtro_entrada (água tratada)
 *        team='posvenda'  → refil, purificador
 *        team='admin'     → tudo (admin pode pegar qualquer lead)
 *   3. Closer DESLIGADO (u.desligado === true) é sempre inválido.
 *
 * O server.js injeta a tabela USERS via setUsersTable(USERS). Sem isso, fica
 * em modo "permissivo" (loga warning, não bloqueia — segurança fail-open
 * apenas em dev; produção SEMPRE deve injetar a tabela).
 */

let _USERS = null;
function setUsersTable(usersObj) { _USERS = usersObj || null; }
function getUsersTable() { return _USERS || {}; }

/**
 * Mapa product_type → chave de permissão.
 */
const PRODUCT_TO_PERM = {
  BEBEDOURO_INDUSTRIAL: 'bebedouro',
  FILTRO_ENTRADA_AGUA_TRATADA: 'filtro_entrada',
  FILTRO_ENTRADA_POCO: 'poco',
  IRON_FREE: 'iron_free',
  SCALE_STOP: 'scale_stop',
  PURIFICADOR: 'purificador',
  REFIL_MANUTENCAO: 'refil',
  PECAS_ACESSORIOS: 'refil',  // mesma equipe que mexe com refil/manutenção
  OUTROS: null,                // sem produto → válido pra todos
};

/**
 * Inferência conservadora de permissões a partir do team (quando USERS não tem
 * permissoes explícitas). Esta é fallback — preferível setar permissoes via UI.
 */
const TEAM_PERMS = {
  bebedouro: { bebedouro: true },
  poco:      { poco: true, iron_free: true, scale_stop: true },
  filtro:    { filtro_entrada: true },
  posvenda:  { refil: true, purificador: true },
  admin:     { bebedouro: true, filtro_entrada: true, poco: true, iron_free: true, scale_stop: true, purificador: true, refil: true },
};

function permsForUser(user) {
  if (!user) return {};
  if (user.permissoes && typeof user.permissoes === 'object') return user.permissoes;
  return TEAM_PERMS[user.team] || {};
}

/**
 * Resolve nome do Owner do Zoho → user do portal (matching frouxo).
 * Retorna {username, ...user} ou null.
 */
function _stripAccents(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function _ownerNameToUser(ownerName) {
  if (!ownerName) return null;
  const norm = _stripAccents(ownerName);
  const USERS = getUsersTable();
  for (const [username, u] of Object.entries(USERS)) {
    const cm = _stripAccents(u.crmOwner || '');
    if (cm === norm) return { username, ...u };
    const uname = _stripAccents(u.name || '');
    if (uname === norm) return { username, ...u };
    const firstName = norm.split(' ')[0];
    if (cm.split(' ')[0] === firstName) return { username, ...u };
  }
  return null;
}

/**
 * Validação principal.
 *
 * @param {object} args
 * @param {string} args.owner_zoho_name   nome do Owner ATUAL do deal no Zoho
 * @param {string} args.product_type      product_type detectado pelo engine
 * @returns {{
 *   ok: boolean,
 *   user: object|null,
 *   reason: string,                       // motivo legível
 *   block_code: string|null,              // OWNER_INVALIDO_PARA_PRODUTO | OWNER_NOT_MAPPED | OWNER_INACTIVE | PRODUCT_PERMISSION_DENIED | OK | NO_OWNER
 *   perms_seen: object|null,
 * }}
 */
function validateOwnerForProduct(args) {
  const ownerName = args.owner_zoho_name;
  const productType = args.product_type;

  if (!ownerName) {
    return { ok: false, user: null, reason: 'Deal sem Owner', block_code: 'NO_OWNER', perms_seen: null };
  }

  const user = _ownerNameToUser(ownerName);
  if (!user) {
    return { ok: false, user: null, reason: `Owner "${ownerName}" não mapeado em USERS do portal`, block_code: 'OWNER_NOT_MAPPED', perms_seen: null };
  }

  if (user.desligado) {
    return { ok: false, user, reason: `Owner ${user.username} está desligado`, block_code: 'OWNER_INACTIVE', perms_seen: null };
  }

  const perms = permsForUser(user);

  if (!productType || productType === 'OUTROS') {
    return { ok: true, user, reason: 'produto OUTROS — passa sem checar permissão', block_code: null, perms_seen: perms };
  }

  const permKey = PRODUCT_TO_PERM[productType];
  if (!permKey) {
    return { ok: true, user, reason: `produto ${productType} sem mapeamento de permissão (default permitir)`, block_code: null, perms_seen: perms };
  }

  if (!perms[permKey]) {
    return {
      ok: false, user,
      reason: `Owner ${user.username} (team=${user.team}) NÃO tem permissão pra produto ${productType} (perm:${permKey}=false)`,
      block_code: 'OWNER_INVALIDO_PARA_PRODUTO',
      perms_seen: perms,
    };
  }

  return { ok: true, user, reason: 'Owner válido', block_code: null, perms_seen: perms };
}

module.exports = {
  setUsersTable,
  getUsersTable,
  validateOwnerForProduct,
  _ownerNameToUser,
  permsForUser,
  PRODUCT_TO_PERM,
  TEAM_PERMS,
};
