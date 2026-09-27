// ============================================================================
// CATÁLOGO DE ACADEMIAS DE TREINAMENTO (por produto)
// ----------------------------------------------------------------------------
// Fonte única para a Central de Treinamentos. Para adicionar uma nova academia
// de produto, basta acrescentar um item aqui:
//   - status 'ativo'  → tem academia estruturada com progresso salvo no kv_store.
//                        Informe `progressPrefix` (chave kv por usuário),
//                        `hubUrl`, `gestorUrl` e `modulosCount`.
//   - status 'em-breve' → só aparece como coluna/placeholder na matriz.
//
// A Central lê o progresso de cada usuário em kv[`${progressPrefix}${username}`]
// e calcula % concluído, prova e certificado — sem acoplar ao motor de cada academia.
// ============================================================================

// contagem de módulos por academia (fonte de verdade: o próprio índice de cada uma)
let bebedouroModulos = 21;
try { bebedouroModulos = require('../treinamento-bebedouros/modulos.js').MODULOS.length; } catch (_) {}
let pocoModulos = 20;
try { pocoModulos = require('../treinamento-poco/modulos.js').MODULOS.length; } catch (_) {}
let feModulos = 10, ssModulos = 9;
try { feModulos = require('../treinamento-filtro-entrada/modulos.js').MODULOS.length; } catch (_) {}
try { ssModulos = require('../treinamento-scale-stop/modulos.js').MODULOS.length; } catch (_) {}

const ACADEMIAS = [
  {
    id: 'bebedouro',
    nome: 'Bebedouro Industrial',
    icon: '🚰',
    cor: '#00AAFF',
    status: 'ativo',
    progressPrefix: 'treinbeb:progress:',
    hubUrl: '/treinamento/bebedouros',
    gestorUrl: '/treinamento/bebedouros/gestor',
    modulosCount: bebedouroModulos,
  },
  {
    id: 'filtro-entrada', nome: 'Filtro de Entrada', icon: '🏠', cor: '#3FB950', status: 'ativo',
    progressPrefix: 'treinfe:progress:', hubUrl: '/treinamento/filtro-entrada',
    gestorUrl: '/treinamento/filtro-entrada/gestor', modulosCount: feModulos,
  },
  {
    id: 'poco',
    nome: 'Tratamento de Água de Poço',
    icon: '💧',
    cor: '#A371F7',
    status: 'ativo',
    progressPrefix: 'treinpoco:progress:',
    hubUrl: '/treinamento/poco',
    gestorUrl: '/treinamento/poco/gestor',
    modulosCount: pocoModulos,
  },
  {
    id: 'scale-stop', nome: 'Scale Stop', icon: '💎', cor: '#22d3ee', status: 'ativo',
    progressPrefix: 'treinss:progress:', hubUrl: '/treinamento/scale-stop',
    gestorUrl: '/treinamento/scale-stop/gestor', modulosCount: ssModulos,
  },
  { id: 'refil-linhas',   nome: 'Refil / American Filter / Condomínio', icon: '🔁', cor: '#F59E0B', status: 'em-breve' },
  { id: 'ozonio',         nome: 'Equipamento de Ozônio',             icon: '🫧', cor: '#22d3ee', status: 'em-breve' },
];

module.exports = { ACADEMIAS };
