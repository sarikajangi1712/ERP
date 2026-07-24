const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createDraftChallan, confirmChallan, cancelChallan } = require('../services/challanService');
const { logAudit } = require('../services/auditService');

async function getChallans(req, res, next) {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { challanNumber: { contains: search, mode: 'insensitive' } },
          { customer: { companyName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, challans] = await Promise.all([
      prisma.salesChallan.count({ where }),
      prisma.salesChallan.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          customer: true,
          warehouse: true,
          createdBy: { select: { id: true, name: true } },
          invoice: { select: { id: true, invoiceNumber: true, paymentStatus: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: challans,
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

async function getChallanById(req, res, next) {
  try {
    const { id } = req.params;
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
      include: {
        customer: true,
        warehouse: true,
        createdBy: { select: { id: true, name: true, role: true } },
        items: { include: { product: true } },
        invoice: true,
      },
    });

    if (!challan) return res.status(404).json({ success: false, message: 'Sales Challan not found' });

    res.json({ success: true, challan });
  } catch (err) {
    next(err);
  }
}

async function createChallan(req, res, next) {
  try {
    const challan = await createDraftChallan({
      ...req.body,
      userId: req.user.id,
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_CHALLAN',
      entity: 'SALES_CHALLAN',
      entityId: challan.id,
      details: `Created draft Sales Challan #${challan.challanNumber}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, challan });
  } catch (err) {
    next(err);
  }
}

async function confirmSalesChallan(req, res, next) {
  try {
    const { id } = req.params;
    const confirmed = await confirmChallan(id, req.user.id);

    await logAudit({
      userId: req.user.id,
      action: 'CONFIRM_CHALLAN',
      entity: 'SALES_CHALLAN',
      entityId: id,
      details: `Confirmed and locked Sales Challan #${confirmed.challanNumber}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Challan confirmed and stock deducted successfully', challan: confirmed });
  } catch (err) {
    next(err);
  }
}

async function cancelSalesChallan(req, res, next) {
  try {
    const { id } = req.params;
    const cancelled = await cancelChallan(id, req.user.id);

    await logAudit({
      userId: req.user.id,
      action: 'CANCEL_CHALLAN',
      entity: 'SALES_CHALLAN',
      entityId: id,
      details: `Cancelled Sales Challan #${cancelled.challanNumber} and restored stock`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Challan cancelled and stock restored successfully', challan: cancelled });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getChallans,
  getChallanById,
  createChallan,
  confirmSalesChallan,
  cancelSalesChallan,
};
