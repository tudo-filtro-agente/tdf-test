#!/usr/bin/env node
/**
 * Importa a planilha do ERP de manutenção (Excel) e gera data/erp-manutencao.json
 * indexado pelos últimos 9 dígitos do telefone.
 *
 * Uso: node scripts/import-erp-manutencao.js <caminho.xlsx>
 *
 * O JSON resultante é lido pelo /manutencao/data pra:
 *   - resolver clientes categorizados como "outros" no Zoho
 *   - mostrar o produto exato que o cliente comprou (mesmo quando Quoted_Items vem vazio)
 *   - usar o ciclo certo pra calcular próxima troca
 */

const path = require('path');
const fs = require('fs');

const arquivo = process.argv[2] || '/Users/paulocamargojunior/Downloads/TudoDeFiltro_Manutencao_CRM_1 (1).xlsx';
if (!fs.existsSync(arquivo)) {
  console.error('❌ Arquivo não encontrado:', arquivo);
  process.exit(1);
}

let XLSX;
try { XLSX = require('xlsx'); }
catch { try { XLSX = require('/tmp/node_modules/xlsx'); } catch { console.error('Instala xlsx primeiro: npm i xlsx'); process.exit(1); } }

const wb = XLSX.readFile(arquivo);
console.log('📂 Planilha:', path.basename(arquivo));
console.log('📑 Sheets:', wb.SheetNames.join(', '));

// Mapa nome-da-aba → categoria interna usada no portal
const SHEET_TO_CATEGORIA = {
  'Purificador':                'purificador',
  'Resfriador':                 'bebedouro',         // resfriador é bebedouro industrial
  'Filtro_de_Entrada_FE___Filtr':'filtro_entrada',
  'Iron_Free':                  'iron_free',
  'Refil':                      'refil',             // categoria nova específica
  'Sem_Classificacao':          'outros',
};

const CICLO_DEFAULT = {
  'purificador':    12,
  'bebedouro':      3,
  'filtro_entrada': 24,
  'iron_free':      24,
  'refil':          12,
  'outros':         12,
};

function clean9(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-9);
}

// Gera múltiplas chaves de busca pro mesmo telefone (cobre diferentes formatos:
// fixo SP 8 dígitos, celular 9 dígitos, com/sem DDD, com/sem DDI 55, com/sem '9' inicial)
function gerarChaves(phoneRaw) {
  if (!phoneRaw) return [];
  const limpo = String(phoneRaw).replace(/\D/g, '');
  if (limpo.length < 7) return [];
  const set = new Set();
  // Variações naturais por tamanho
  if (limpo.length >= 8) set.add(limpo.slice(-8));
  if (limpo.length >= 9) set.add(limpo.slice(-9));
  if (limpo.length >= 10) set.add(limpo.slice(-10));
  if (limpo.length >= 11) set.add(limpo.slice(-11));
  // Sem DDI 55 quando vem com 12-13 dígitos
  if (limpo.length === 13 && limpo.startsWith('55')) {
    const semDdi = limpo.slice(2);
    set.add(semDdi); set.add(semDdi.slice(-9)); set.add(semDdi.slice(-8));
  }
  if (limpo.length === 12 && limpo.startsWith('55')) {
    const semDdi = limpo.slice(2);
    set.add(semDdi); set.add(semDdi.slice(-9)); set.add(semDdi.slice(-8));
  }
  // Variações com/sem '9' do celular (BR adicionou 9 na frente em 2014)
  // Se celular tem 9 dígitos começando com 9, gera versão sem o 9 inicial
  if (limpo.length >= 9) {
    const last9 = limpo.slice(-9);
    if (last9[0] === '9') set.add(last9.slice(1)); // 988247651 → 88247651
  }
  // Se tem 8 dígitos começando com 8 ou 9 (formato antigo de celular), gera versão com 9
  if (limpo.length === 8 && /^[6789]/.test(limpo)) {
    set.add('9' + limpo);
  }
  return [...set].filter(k => k.length >= 7 && k.length <= 13);
}

function parseDateBr(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

const erp = {};      // chave: variações de telefone → registro
const lista = [];    // lista plana de todos os registros únicos (pra iteração)
const stats = { total: 0, comFone: 0, semFone: 0, porCategoria: {}, conflitos: 0 };

for (const sheetName of Object.keys(SHEET_TO_CATEGORIA)) {
  if (!wb.Sheets[sheetName]) {
    console.warn('⚠️  Sheet ausente:', sheetName);
    continue;
  }
  const categoria = SHEET_TO_CATEGORIA[sheetName];
  const ciclo = CICLO_DEFAULT[categoria];
  // sheet_to_json com header:1 dá array de arrays (mais previsível com __EMPTY)
  const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
  // A primeira linha é o título; a segunda é o header real
  // Header: [Nome, CPF/CNPJ, Telefone, Celular, E-mail, Cidade, UF, Última Compra,
  //          Dias sem Compra, Dias de Atraso, Prioridade, Produtos, Total Gasto, N° Compras]
  const linhas = aoa.slice(2); // pula título + header
  let countSheet = 0;
  for (const r of linhas) {
    if (!r || !r[0]) continue;
    const nome = String(r[0] || '').trim();
    const cpf = String(r[1] || '').trim();
    const telefone = String(r[2] || '').trim();
    const celular  = String(r[3] || '').trim();
    const email    = String(r[4] || '').trim();
    const cidade   = String(r[5] || '').trim();
    const uf       = String(r[6] || '').trim();
    const ultimaCompra = parseDateBr(r[7]);
    const diasSemCompra = parseInt(r[8]) || 0;
    const diasAtraso    = parseInt(r[9]) || 0;
    const prioridade    = String(r[10] || '').trim();
    const produtos      = String(r[11] || '').trim();
    const totalGasto    = parseFloat(r[12]) || 0;
    const nCompras      = parseInt(r[13]) || 0;

    // Gera TODAS as variações possíveis (last 7/8/9/10/11, com/sem DDI, com/sem 9 do celular)
    const chaves = [...new Set([...gerarChaves(telefone), ...gerarChaves(celular)])];

    stats.total++;
    if (!chaves.length) { stats.semFone++; continue; }
    stats.comFone++;
    stats.porCategoria[categoria] = (stats.porCategoria[categoria] || 0) + 1;

    // ID único pro cliente (gerado a partir da chave mais longa)
    const idChave = chaves.sort((a,b) => b.length - a.length)[0];
    const reg = {
      idErp: 'erp:' + idChave,
      nome, cpf, email, cidade, uf,
      telefone: telefone || celular,
      telefoneOriginal: telefone, celularOriginal: celular,
      categoria, categoriaSheet: sheetName, ciclo,
      ultimaCompra, diasSemCompra, diasAtraso, prioridade,
      produtos,
      totalGasto, nCompras,
    };
    lista.push(reg);

    // Índice guarda só o idErp (referência leve); lista tem o dado completo
    for (const k of chaves) {
      const idAtual = erp[k];
      if (idAtual && idAtual !== reg.idErp) {
        // Conflito de chave: ignora (primeiro registro fica)
        stats.conflitos++;
        continue;
      }
      erp[k] = reg.idErp;
    }
    countSheet++;
  }
  console.log(`  ✓ ${sheetName} (${categoria}): ${countSheet} clientes`);
}

const out = path.join(__dirname, '..', 'data', 'erp-manutencao.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({
  generatedAt: new Date().toISOString(),
  fonte: path.basename(arquivo),
  stats,
  index: erp,
  lista, // array plano com todos os clientes únicos pra iteração
}, null, 0));

console.log('\n📊 Stats:');
console.log('  Total linhas processadas:', stats.total);
console.log('  Com telefone:', stats.comFone);
console.log('  Sem telefone:', stats.semFone);
console.log('  Conflitos (mesmo fone em 2 sheets):', stats.conflitos);
console.log('  Por categoria:', stats.porCategoria);
console.log('  Total no índice:', Object.keys(erp).length);
console.log('\n💾 JSON salvo em:', out);
