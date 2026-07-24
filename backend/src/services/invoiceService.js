const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');

async function generateInvoiceNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.invoice.count();
  const seq = String(count + 1).padStart(4, '0');
  return `INV-${dateStr}-${seq}`;
}

async function createInvoiceFromChallan(challanId, userId) {
  const challan = await prisma.salesChallan.findUnique({
    where: { id: challanId },
    include: { items: { include: { product: true } }, customer: true, invoice: true },
  });

  if (!challan) throw new Error('Sales Challan not found');
  if (challan.status !== 'CONFIRMED') throw new Error('Invoices can only be generated from CONFIRMED sales challans');
  if (challan.invoice) throw new Error(`An invoice (${challan.invoice.invoiceNumber}) already exists for this challan`);

  const invoiceNumber = await generateInvoiceNumber();
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days net terms

  const invoiceItems = challan.items.map(item => ({
    description: item.product.name,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    gstRate: item.gstRate,
    totalAmount: item.totalAmount,
  }));

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      challanId: challan.id,
      customerId: challan.customerId,
      paymentStatus: 'PENDING',
      subTotal: challan.subTotal,
      taxAmount: challan.taxAmount,
      discountAmount: challan.discountAmount,
      grandTotal: challan.grandTotal,
      dueDate,
      notes: `Generated from Sales Challan #${challan.challanNumber}`,
      items: {
        create: invoiceItems,
      },
    },
    include: { customer: true, items: true, challan: true },
  });

  await createNotification({
    userId,
    title: '🧾 Tax Invoice Generated',
    message: `Tax Invoice ${invoice.invoiceNumber} generated for ${challan.customer.companyName}`,
    type: 'INFO',
    link: `/invoices/${invoice.id}`,
  });

  return invoice;
}

async function updatePaymentStatus(invoiceId, { paymentStatus, paidAmount, notes }) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new Error('Invoice not found');

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paymentStatus,
      paidAmount: paidAmount !== undefined ? paidAmount : invoice.paidAmount,
      notes: notes || invoice.notes,
    },
    include: { customer: true, items: true },
  });

  return updated;
}

module.exports = { createInvoiceFromChallan, updatePaymentStatus };
