const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createInvoiceFromChallan, updatePaymentStatus } = require('../services/invoiceService');
const { buildInvoicePDF } = require('../utils/pdfGenerator');
const { logAudit } = require('../services/auditService');

async function getInvoices(req, res, next) {
  try {
    const { paymentStatus, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(paymentStatus && { paymentStatus }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { customer: { companyName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          customer: true,
          challan: { select: { id: true, challanNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getInvoiceById(req, res, next) {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        challan: true,
        items: true,
      },
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.json({ success: true, invoice });
  } catch (err) {
    next(err);
  }
}

async function generateFromChallan(req, res, next) {
  try {
    const { challanId } = req.params;
    const invoice = await createInvoiceFromChallan(challanId, req.user.id);

    await logAudit({
      userId: req.user.id,
      action: 'GENERATE_INVOICE',
      entity: 'INVOICE',
      entityId: invoice.id,
      details: `Generated Tax Invoice #${invoice.invoiceNumber} from Challan [${challanId}]`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Invoice generated successfully', invoice });
  } catch (err) {
    next(err);
  }
}

async function updatePayment(req, res, next) {
  try {
    const { id } = req.params;
    const invoice = await updatePaymentStatus(id, req.body);

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_PAYMENT',
      entity: 'INVOICE',
      entityId: id,
      details: `Updated invoice #${invoice.invoiceNumber} payment status to ${invoice.paymentStatus}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Payment status updated', invoice });
  } catch (err) {
    next(err);
  }
}

async function downloadInvoicePDF(req, res, next) {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { customer: true, items: true },
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`);

    buildInvoicePDF(invoice, res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInvoices,
  getInvoiceById,
  generateFromChallan,
  updatePayment,
  downloadInvoicePDF,
};
