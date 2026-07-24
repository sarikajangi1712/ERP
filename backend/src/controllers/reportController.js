const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateCSV } = require('../utils/csvExporter');

async function getSalesReport(req, res, next) {
  try {
    const { startDate, endDate, exportCsv } = req.query;

    const where = {
      status: 'CONFIRMED',
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const sales = await prisma.salesChallan.findMany({
      where,
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    if (exportCsv === 'true') {
      const headers = [
        { label: 'Challan No', key: 'challanNumber' },
        { label: 'Date', key: 'createdAt' },
        { label: 'Customer', key: 'companyName' },
        { label: 'Subtotal (INR)', key: 'subTotal' },
        { label: 'GST Tax (INR)', key: 'taxAmount' },
        { label: 'Grand Total (INR)', key: 'grandTotal' },
      ];

      const rows = sales.map((s) => ({
        challanNumber: s.challanNumber,
        createdAt: new Date(s.createdAt).toLocaleDateString(),
        companyName: s.customer.companyName,
        subTotal: s.subTotal,
        taxAmount: s.taxAmount,
        grandTotal: s.grandTotal,
      }));

      const csvContent = generateCSV(rows, headers);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.csv"');
      return res.status(200).send(csvContent);
    }

    res.json({ success: true, sales });
  } catch (err) {
    next(err);
  }
}

async function getInventoryReport(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        inventories: { include: { warehouse: true } },
      },
    });

    const report = products.map((p) => {
      const totalQty = p.inventories.reduce((acc, inv) => acc + inv.quantity, 0);
      const totalValuation = totalQty * Number(p.purchasePrice);
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category.name,
        unitPrice: p.purchasePrice,
        totalQty,
        totalValuation,
      };
    });

    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
}

async function getGSTReport(req, res, next) {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: true, items: true },
      orderBy: { createdAt: 'desc' },
    });

    let totalSubtotal = 0;
    let totalGST = 0;
    let totalGrand = 0;

    invoices.forEach((inv) => {
      totalSubtotal += Number(inv.subTotal);
      totalGST += Number(inv.taxAmount);
      totalGrand += Number(inv.grandTotal);
    });

    res.json({
      success: true,
      summary: {
        totalInvoices: invoices.length,
        totalSubtotal,
        totalGST,
        totalGrand,
      },
      invoices,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSalesReport,
  getInventoryReport,
  getGSTReport,
};
