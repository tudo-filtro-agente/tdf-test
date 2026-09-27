// ============================================================================
// FONTES E GOVERNANÇA — referências técnicas da academia de Água de Poço
// ----------------------------------------------------------------------------
// Regra (briefing TDF): conteúdo sobre saúde/potabilidade deve mostrar fonte e
// data da última revisão. NÃO usar blog comercial como fonte de limite regulatório.
// Preencher/atualizar os campos `data`, `link` e `ultimaRevisao` com o documento
// oficial fornecido pela Tudo de Filtro.
// ============================================================================

const FONTES = [
  {
    fonte: 'Portaria GM/MS nº 888/2021',
    orgao: 'Ministério da Saúde (Brasil)',
    documento: 'Padrão de potabilidade da água para consumo humano (altera Anexo XX da Portaria de Consolidação GM/MS nº 5/2017)',
    data: null,                 // preencher: data de publicação/vigência confirmada
    link: null,                 // preencher: link oficial (gov.br / DOU)
    parametrosRelacionados: 'Todos os parâmetros de potabilidade (físicos, químicos, microbiológicos)',
    ultimaRevisao: null,        // preencher: quando a TDF revisou por último
    status: 'pendente de validação técnica pela Tudo de Filtro',
  },
  // Espaços reservados para documentos-mestre da TDF (dimensionamento, mídias,
  // válvulas Runxin, procedimentos de coleta, etc.) — cadastrar conforme fornecidos.
  {
    fonte: 'Documento-mestre TDF — Tratamento de Água de Poço',
    orgao: 'Tudo de Filtro',
    documento: 'A ser fornecido — base técnica oficial para módulos, vazões, mídias e dimensionamento',
    data: null, link: null, parametrosRelacionados: 'Conteúdo técnico dos módulos 1–15 e 19',
    ultimaRevisao: null,
    status: 'aguardando documento-mestre',
  },
];

module.exports = { FONTES };
