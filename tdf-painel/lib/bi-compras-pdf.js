// lib/bi-compras-pdf.js — Gera PDF do pedido de compra (pdfkit)
//
// Layout: cabeçalho com empresa solicitante + dados do fornecedor + tabela de itens + assinatura.
// Retorna Buffer pra streaming direto no response.

const PDFDocument = require('pdfkit');

const fmtBRL = (v) => 'R$ ' + Number(v||0).toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
const fmtDate = (d) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('pt-BR'); } catch(_) { return String(d); } };

function gerarPdfPedido(comp) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cabeçalho
      doc.fontSize(18).fillColor('#0066CC').text(`PEDIDO DE COMPRA #${comp.numero_seq}`, { align: 'left' });
      doc.fontSize(9).fillColor('#666').text(`Emitido em ${fmtDate(comp.decidida_em || comp.created_at)}`, { align: 'left' });
      doc.moveDown(0.5);

      // Linha
      doc.strokeColor('#0066CC').lineWidth(1.2).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.8);

      // Bloco solicitante / fornecedor (2 colunas)
      const startY = doc.y;
      doc.fontSize(10).fillColor('#000');
      doc.font('Helvetica-Bold').text('SOLICITANTE', 40, startY);
      doc.font('Helvetica').fontSize(9);
      doc.text(comp.empresa_nome || 'Tudo de Filtro', 40, doc.y + 2);
      doc.text(`Usuário: ${comp.solicitante_username || '—'}`, 40);
      doc.text(`Urgência: ${(comp.urgencia||'normal').toUpperCase()}`, 40);

      doc.font('Helvetica-Bold').fontSize(10).text('FORNECEDOR', 300, startY);
      doc.font('Helvetica').fontSize(9);
      doc.text(comp.fornecedor_nome_db || comp.fornecedor_nome || '—', 300, doc.y - (doc.y - startY - 12));
      if (comp.fornecedor_doc)      doc.text(`CNPJ/CPF: ${comp.fornecedor_doc}`, 300);
      if (comp.fornecedor_email)    doc.text(`Email: ${comp.fornecedor_email}`, 300);
      if (comp.fornecedor_telefone) doc.text(`Tel: ${comp.fornecedor_telefone}`, 300);

      // Garante que próxima seção começa abaixo do bloco maior
      doc.y = Math.max(doc.y, startY + 60);
      doc.moveDown(1);

      // Justificativa
      if (comp.justificativa) {
        doc.font('Helvetica-Bold').fontSize(10).text('Justificativa:');
        doc.font('Helvetica').fontSize(9).text(comp.justificativa, { width: 515 });
        doc.moveDown(0.6);
      }

      // Tabela de itens
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0066CC').text('ITENS DO PEDIDO');
      doc.fillColor('#000').moveDown(0.4);

      // Header da tabela
      const colX = { ord: 40, prod: 70, qtd: 360, unit: 420, total: 490 };
      const tableTop = doc.y;
      doc.font('Helvetica-Bold').fontSize(9);
      doc.text('#', colX.ord, tableTop);
      doc.text('PRODUTO', colX.prod, tableTop);
      doc.text('QTD', colX.qtd, tableTop, { width: 50, align: 'right' });
      doc.text('UNIT.', colX.unit, tableTop, { width: 60, align: 'right' });
      doc.text('TOTAL', colX.total, tableTop, { width: 65, align: 'right' });
      doc.moveTo(40, tableTop + 14).lineTo(555, tableTop + 14).strokeColor('#999').lineWidth(0.5).stroke();
      doc.y = tableTop + 18;

      // Linhas
      doc.font('Helvetica').fontSize(9);
      let totalGeral = 0;
      for (const it of (comp.itens||[])) {
        if (doc.y > 730) { doc.addPage(); doc.y = 50; }
        const rowY = doc.y;
        const valor = Number(it.qtd||0) * Number(it.custo_unit_estimado||0);
        totalGeral += valor;
        doc.text(String(it.ordem), colX.ord, rowY);
        const nomeProd = it.produto_nome || it.produto_nome_db || it.sku || '—';
        doc.text(nomeProd, colX.prod, rowY, { width: 280 });
        doc.text(Number(it.qtd||0).toFixed(2), colX.qtd, rowY, { width: 50, align: 'right' });
        doc.text(fmtBRL(it.custo_unit_estimado||0), colX.unit, rowY, { width: 60, align: 'right' });
        doc.text(fmtBRL(valor), colX.total, rowY, { width: 65, align: 'right' });
        if (it.observacoes) {
          doc.y = doc.y + 11;
          doc.fontSize(8).fillColor('#666').text('Obs: ' + it.observacoes, colX.prod, doc.y, { width: 380 });
          doc.fontSize(9).fillColor('#000');
        }
        doc.moveDown(0.6);
      }
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#999').lineWidth(0.5).stroke();
      doc.moveDown(0.4);

      // Total
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0066CC');
      doc.text('TOTAL DO PEDIDO:', colX.unit - 40, doc.y, { width: 100, align: 'right' });
      doc.text(fmtBRL(totalGeral), colX.total, doc.y - 12, { width: 65, align: 'right' });
      doc.fillColor('#000');
      doc.moveDown(2);

      // Aprovação
      if (comp.aprovador_username) {
        doc.fontSize(9).font('Helvetica').text(`Aprovado por: ${comp.aprovador_username} em ${fmtDate(comp.decidida_em)}`);
      }

      // Rodapé
      doc.fontSize(8).fillColor('#666').text(
        `Tudo de Filtro · Pedido gerado pelo Portal TDF · ${new Date().toLocaleString('pt-BR')}`,
        40, 800, { align: 'center', width: 515 }
      );

      doc.end();
    } catch(e) { reject(e); }
  });
}

module.exports = { gerarPdfPedido };
