// ============================================================================
// PREÇOS — arquivo de CONFIGURAÇÃO (nunca fixar preço em componente/view)
// ----------------------------------------------------------------------------
// Para atualizar preços: edite SOMENTE este arquivo.
//
// bebedouros[].fonte = 'site' → preço extraído do site em 02/jul/2026.
//   ⚠️ Preço de vitrine do site pode divergir do preço de proposta/tabela.
//   Marcado `validar: true` — confirmar com a operação antes de usar em treino oficial.
// ============================================================================

const BEBEDOUROS = [
  { litros: 15,  precoParcelado: 1690.00, parcelas: 7, valorParcela: 241.00, precoPix: 1550.00, fonte: 'site', validar: true },
  { litros: 25,  precoParcelado: 1890.00, parcelas: 7, valorParcela: 270.00, precoPix: 1750.00, fonte: 'site', validar: true },
  { litros: 60,  precoParcelado: 2245.00, parcelas: 7, valorParcela: 321.00, precoPix: 2132.00, fonte: 'site', validar: true },
  { litros: 100, precoParcelado: 2450.00, parcelas: 7, valorParcela: 350.00, precoPix: 2328.00, fonte: 'site', validar: true },
  { litros: 200, precoParcelado: 3413.00, parcelas: 7, valorParcela: 488.00, precoPix: 3242.00, fonte: 'site', validar: true },
];

// Oferta oficial de UPSELL dos refis (fornecida pela empresa no briefing)
const UPSELL_REFIL = {
  produto: 'Acquabios Multi',
  precoUnitario: 69.00,          // R$ por refil (preço normal)
  qtdOferta: 3,                  // leva 3 adicionais
  precoTresNormal: 207.00,       // 3 x 69
  precoTresPromo: 159.00,        // condição com a compra do bebedouro
  economia: 48.00,               // 207 - 159
  primeiroBrinde: true,          // 1º refil já acompanha o bebedouro
  totalRefisComOferta: 4,        // 1 brinde + 3 adicionais
  coberturaTexto: 'aproximadamente um ano de trocas programadas, conforme a periodicidade orientada e as condições de uso',
  // NÃO afirmar prazo fixo de troca como garantia. Ciclo depende do uso e da água.
};

// Helpers de formatação (usados nas views e no simulador de upsell)
function brl(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function precoDoModelo(litros) {
  return BEBEDOUROS.find(b => b.litros === Number(litros)) || null;
}

module.exports = { BEBEDOUROS, UPSELL_REFIL, brl, precoDoModelo };
