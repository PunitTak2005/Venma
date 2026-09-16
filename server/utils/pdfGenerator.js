const PDFDocument = require('pdfkit');

/**
 * Generate A4 invoice PDF as stream
 */
const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="VENMA-Invoice-${order.orderNumber || order._id}.pdf"`
  );

  doc.pipe(res);

  // Header Banner
  doc.rect(0, 0, doc.page.width, 70).fill('#0F172A');
  doc.fillColor('#FFFFFF')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('VENMA', 40, 22);

  doc.fontSize(10)
     .font('Helvetica')
     .text('Official Order Invoice & Receipt', 40, 48);

  doc.fillColor('#FFFFFF')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text(`ORDER #${order.orderNumber}`, 400, 25, { align: 'right' });
  
  doc.fontSize(9)
     .font('Helvetica')
     .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 45, { align: 'right' });

  // Bill To & Order Summary Info
  doc.moveDown(3);
  const startY = 95;
  doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Billed To:', 40, startY);
  doc.fontSize(10).font('Helvetica').fillColor('#334155');
  doc.text(order.shippingAddress?.name || 'Customer Name', 40, startY + 18);
  doc.text(order.shippingAddress?.street || '123 Market St', 40, startY + 32);
  doc.text(
    `${order.shippingAddress?.city || 'City'}, ${order.shippingAddress?.state || 'State'} ${order.shippingAddress?.zipCode || '10001'}`,
    40,
    startY + 46
  );
  doc.text(`Phone: ${order.shippingAddress?.phone || 'N/A'}`, 40, startY + 60);

  doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Payment Details:', 350, startY);
  doc.fontSize(10).font('Helvetica').fillColor('#334155');
  doc.text(`Method: ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}`, 350, startY + 18);
  doc.text(`Status: ${order.isPaid ? 'PAID' : 'PENDING PAYMENT'}`, 350, startY + 32);
  doc.text(`Order Status: ${order.orderStatus ? order.orderStatus.toUpperCase() : 'PENDING'}`, 350, startY + 46);

  // Table Headers
  const tableTop = 190;
  doc.rect(40, tableTop, 515, 24).fill('#F1F5F9');
  doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold');
  doc.text('Item Description', 50, tableTop + 7);
  doc.text('Qty', 330, tableTop + 7, { width: 40, align: 'center' });
  doc.text('Unit Price', 380, tableTop + 7, { width: 70, align: 'right' });
  doc.text('Total', 460, tableTop + 7, { width: 85, align: 'right' });

  // Table Rows
  let y = tableTop + 30;
  doc.font('Helvetica').fontSize(9).fillColor('#334155');

  order.items.forEach((item, index) => {
    const itemTotal = Number(item.price * item.quantity).toLocaleString('en-IN');
    doc.text(`${index + 1}. ${item.name}`, 50, y, { width: 270, ellipsis: true });
    doc.text(item.quantity.toString(), 330, y, { width: 40, align: 'center' });
    doc.text(`INR ${Number(item.price).toLocaleString('en-IN')}`, 380, y, { width: 70, align: 'right' });
    doc.text(`INR ${itemTotal}`, 450, y, { width: 95, align: 'right' });
    
    // light separator
    y += 18;
    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, y).lineTo(555, y).stroke();
    y += 8;
  });

  // Summary section
  y = Math.max(y, 350);
  doc.rect(330, y, 225, 110).fill('#F8FAFC').stroke('#E2E8F0');
  doc.fillColor('#475569').fontSize(10);
  
  doc.text('Subtotal:', 340, y + 12);
  doc.text(`INR ${Number(order.subtotal || 0).toLocaleString('en-IN')}`, 440, y + 12, { width: 105, align: 'right' });

  doc.text('Shipping:', 340, y + 30);
  doc.text(order.shippingFee === 0 ? 'FREE' : `INR ${Number(order.shippingFee || 0).toLocaleString('en-IN')}`, 440, y + 30, { width: 105, align: 'right' });

  doc.text('GST (18%):', 340, y + 48);
  doc.text(`INR ${Number(order.tax || 0).toLocaleString('en-IN')}`, 440, y + 48, { width: 105, align: 'right' });

  if (order.discount && order.discount > 0) {
    doc.fillColor('#10B981');
    doc.text('Discount:', 340, y + 66);
    doc.text(`-INR ${Number(order.discount).toLocaleString('en-IN')}`, 440, y + 66, { width: 105, align: 'right' });
  }

  doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(340, y + 84).lineTo(545, y + 84).stroke();
  doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(11);
  doc.text('Total Amount:', 340, y + 92);
  doc.text(`INR ${Number(order.totalAmount || 0).toLocaleString('en-IN')}`, 440, y + 92, { width: 105, align: 'right' });

  // Security / Verification Badge & Footer
  doc.fillColor('#64748B').fontSize(8.5).font('Helvetica');
  doc.text('VENMA • Registered Office: 184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India', 40, doc.page.height - 70, {
    align: 'center',
    width: 515,
  });
  doc.text('Customer Helpline: +91 6367088841 • support@markethub.com • Authenticated Tax Invoice', 40, doc.page.height - 56, {
    align: 'center',
    width: 515,
  });

  doc.end();
};

/**
 * Generate Admin / Vendor Reports PDF
 */
const generateReportPDF = (title, metrics, rows, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title.replace(/\s+/g, '_')}.pdf`);

  doc.pipe(res);

  // Header
  doc.rect(0, 0, doc.page.width, 70).fill('#0F172A');
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('VENMA Analytics', 40, 20);
  doc.fontSize(10).font('Helvetica').text(`Executive Summary Report: ${title}`, 40, 48);
  doc.fontSize(9).text(`Generated: ${new Date().toLocaleString()}`, 380, 48, { align: 'right' });

  // Metric Cards
  let y = 90;
  doc.fontSize(11).fillColor('#0F172A').font('Helvetica-Bold').text('Key Performance Indicators', 40, y);
  y += 20;

  const cardWidth = 120;
  metrics.forEach((m, idx) => {
    const x = 40 + idx * (cardWidth + 10);
    doc.rect(x, y, cardWidth, 50).fill('#F8FAFC').stroke('#CBD5E1');
    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text(m.label, x + 8, y + 10);
    doc.fillColor('#0F172A').fontSize(13).font('Helvetica-Bold').text(m.value, x + 8, y + 25);
  });

  // Table Data
  y += 75;
  doc.fontSize(11).fillColor('#0F172A').font('Helvetica-Bold').text('Data Breakdown', 40, y);
  y += 20;

  doc.rect(40, y, 515, 22).fill('#2563EB');
  doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
  doc.text('Identifier / Name', 50, y + 6);
  doc.text('Metric / Detail', 250, y + 6);
  doc.text('Volume', 380, y + 6, { width: 60, align: 'right' });
  doc.text('Revenue', 460, y + 6, { width: 85, align: 'right' });

  y += 26;
  doc.font('Helvetica').fontSize(9).fillColor('#334155');

  rows.forEach((r) => {
    doc.text(r.name || '', 50, y, { width: 190, ellipsis: true });
    doc.text(r.detail || '', 250, y, { width: 120, ellipsis: true });
    doc.text(r.volume ? r.volume.toString() : '0', 380, y, { width: 60, align: 'right' });
    doc.text(r.revenue ? `$${Number(r.revenue).toFixed(2)}` : '$0.00', 460, y, { width: 85, align: 'right' });
    y += 18;
    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, y).lineTo(555, y).stroke();
    y += 6;
  });

  doc.fillColor('#64748B').fontSize(8.5).font('Helvetica');
  doc.text('VENMA • 184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India • Confidential Report', 40, doc.page.height - 40, {
    align: 'center',
    width: 515,
  });

  doc.end();
};

module.exports = { generateInvoicePDF, generateReportPDF };
