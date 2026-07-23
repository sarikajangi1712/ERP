const PDFDocument = require('pdfkit');

function buildInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(res);

  // Header
  doc
    .fillColor('#1E293B')
    .fontSize(20)
    .text('MINI ERP + CRM OPERATIONS PORTAL', 50, 40)
    .fontSize(10)
    .text('Tax Invoice / Bill of Supply', 50, 65)
    .text(`Invoice No: ${invoice.invoiceNumber}`, 400, 40)
    .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 400, 55)
    .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 400, 70)
    .moveDown();

  doc.lineCap('butt').moveTo(50, 95).lineTo(550, 95).stroke('#CBD5E1');

  // Customer Details
  doc
    .fontSize(12)
    .fillColor('#0F172A')
    .text('Billed To:', 50, 110)
    .fontSize(10)
    .fillColor('#334155')
    .text(invoice.customer.companyName, 50, 125)
    .text(`Attn: ${invoice.customer.contactPerson}`, 50, 140)
    .text(`GSTIN: ${invoice.customer.gstNumber || 'N/A'}`, 50, 155)
    .text(`${invoice.customer.address}, ${invoice.customer.city}, ${invoice.customer.state} - ${invoice.customer.pincode}`, 50, 170)
    .moveDown();

  // Table Header
  const tableTop = 205;
  doc
    .fillColor('#0F172A')
    .fontSize(10)
    .text('Item Description', 50, tableTop)
    .text('Qty', 280, tableTop)
    .text('Unit Price', 340, tableTop)
    .text('GST Rate', 420, tableTop)
    .text('Total (INR)', 480, tableTop);

  doc.lineCap('butt').moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#94A3B8');

  let y = tableTop + 25;
  invoice.items.forEach(item => {
    doc
      .fillColor('#334155')
      .fontSize(9)
      .text(item.description, 50, y, { width: 220 })
      .text(item.quantity.toString(), 280, y)
      .text(`₹${Number(item.unitPrice).toFixed(2)}`, 340, y)
      .text(`${Number(item.gstRate).toFixed(1)}%`, 420, y)
      .text(`₹${Number(item.totalAmount).toFixed(2)}`, 480, y);
    y += 20;
  });

  doc.lineCap('butt').moveTo(50, y + 10).lineTo(550, y + 10).stroke('#CBD5E1');

  // Financial Totals
  const totalsY = y + 25;
  doc
    .fontSize(10)
    .fillColor('#0F172A')
    .text(`Subtotal: ₹${Number(invoice.subTotal).toFixed(2)}`, 380, totalsY)
    .text(`GST Tax: ₹${Number(invoice.taxAmount).toFixed(2)}`, 380, totalsY + 15)
    .text(`Discount: ₹${Number(invoice.discountAmount).toFixed(2)}`, 380, totalsY + 30)
    .fontSize(12)
    .fillColor('#1E3A8A')
    .text(`Grand Total: ₹${Number(invoice.grandTotal).toFixed(2)}`, 380, totalsY + 50);

  // Footer
  doc
    .fontSize(8)
    .fillColor('#94A3B8')
    .text('This is a computer-generated tax invoice. Thank you for your business!', 50, 700, { align: 'center' });

  doc.end();
}

module.exports = { buildInvoicePDF };
