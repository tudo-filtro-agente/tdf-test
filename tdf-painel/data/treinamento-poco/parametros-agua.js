// ============================================================================
// PARÂMETROS DE QUALIDADE DA ÁGUA — arquivo de CONFIGURAÇÃO (não fixar em componente)
// ----------------------------------------------------------------------------
// REGRA (briefing TDF): valores regulatórios ficam AQUI, associados à fonte oficial.
//   - NÃO inventar limites. Todo `vmp` (Valor Máximo Permitido) nasce `null` e
//     precisa ser preenchido a partir do documento oficial pela Tudo de Filtro.
//   - Fonte de referência vigente: Portaria GM/MS nº 888/2021 (e atualizações).
//     Confirmar sempre o Anexo/valor vigente antes de publicar.
//   - `unidade` é padrão de laudo (não é limite) — mantida para orientar leitura.
//
// Enquanto `vmp === null`, a UI trata como "pendente de validação técnica".
// ============================================================================

const FONTE_PADRAO = 'Portaria GM/MS nº 888/2021';
const STATUS_PENDENTE = 'pendente de validação técnica pela Tudo de Filtro';

// helper para criar linha sem repetir campos
const P = (nome, grupo, unidade, extra = {}) => ({
  nome, grupo, unidade,
  vmp: null,                 // ⚠️ preencher do documento oficial — NÃO inventar
  fonte: FONTE_PADRAO,
  status: STATUS_PENDENTE,
  ultimaRevisao: null,       // data em que a TDF validou o valor
  ...extra,
});

const PARAMETROS = {
  meta: {
    referenciaVigente: FONTE_PADRAO,
    observacao: 'Padrão de potabilidade da água para consumo humano no Brasil. Confirmar Anexo e valor vigente no documento oficial antes de usar comercialmente.',
    avisoObrigatorio: 'Todo conteúdo sobre potabilidade deve exibir fonte e data da última revisão. Não usar blog comercial como fonte de limite.',
  },
  fisicos: [
    P('Cor aparente', 'físico', 'uH (unidade Hazen / mg Pt-Co/L)'),
    P('Cor verdadeira', 'físico', 'uH'),
    P('Turbidez', 'físico', 'uT (NTU)'),
    P('Sólidos', 'físico', 'mg/L'),
    P('Odor', 'físico', 'qualitativo'),
    P('Aspecto', 'físico', 'qualitativo'),
  ],
  quimicos: [
    P('pH', 'químico', '— (escala 0–14)'),
    P('Alcalinidade', 'químico', 'mg/L CaCO₃'),
    P('Dureza total', 'químico', 'mg/L CaCO₃', { classe: 'organoléptico/aceitação', obs: 'Padrão de aceitação (conforto/incrustação/corrosão), não risco agudo à saúde na Portaria 888/2021. VMP a confirmar na fonte oficial — estar dentro do limite NÃO significa ausência de incrustação.' }),
    P('Ferro', 'químico', 'mg/L'),
    P('Manganês', 'químico', 'mg/L'),
    P('Cloretos', 'químico', 'mg/L'),
    P('Sulfatos', 'químico', 'mg/L'),
    P('Fluoreto', 'químico', 'mg/L'),
    P('Nitrato', 'químico', 'mg/L (como N)'),
    P('Nitrito', 'químico', 'mg/L (como N)'),
    P('Amônia', 'químico', 'mg/L (como N)'),
    P('Condutividade', 'químico', 'µS/cm'),
    P('Sólidos dissolvidos totais (SDT)', 'químico', 'mg/L'),
    P('Sílica', 'químico', 'mg/L'),
    P('Metais (diversos)', 'químico', 'mg/L', { obs: 'Cada metal tem VMP próprio — cadastrar individualmente conforme o laudo.' }),
    P('Compostos orgânicos', 'químico', 'µg/L', { obs: 'Depende do composto — exige análise específica.' }),
    P('Agrotóxicos', 'químico', 'µg/L', { obs: 'Quando aplicável à região/atividade agrícola. VMP por substância.' }),
  ],
  microbiologicos: [
    P('Coliformes totais', 'microbiológico', 'presença/ausência em 100 mL'),
    P('Escherichia coli', 'microbiológico', 'presença/ausência em 100 mL'),
    P('Bactérias heterotróficas', 'microbiológico', 'UFC/mL'),
  ],
};

// lista achatada (útil para o Módulo 2 e para a prova)
PARAMETROS.todos = [...PARAMETROS.fisicos, ...PARAMETROS.quimicos, ...PARAMETROS.microbiologicos];

module.exports = { PARAMETROS, FONTE_PADRAO, STATUS_PENDENTE };
