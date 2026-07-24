const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { adjustStock, transferStock } = require('../services/inventoryService');
const { logAudit } = require('../services/auditService');

async function getStockLevels(req, res, next) {
  try {
    const { warehouseId, search } = req.query;

    const inventories = await prisma.inventory.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        product: {
          deletedAt: null,
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
      },
      include: {
        product: { include: { category: true } },
        warehouse: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, inventories });
  } catch (err) {
    next(err);
  }
}

async function handleStockAdjustment(req, res, next) {
  try {
    const { productId, warehouseId, quantity, type, remarks } = req.body;

    const inventory = await adjustStock({
      productId,
      warehouseId,
      quantity: Number(quantity),
      type,
      remarks,
      userId: req.user.id,
    });

    await logAudit({
      userId: req.user.id,
      action: type,
      entity: 'INVENTORY',
      entityId: inventory.id,
      details: `Adjusted stock (${type}) by ${quantity} units for SKU [${productId}] in warehouse [${warehouseId}]`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Stock adjusted successfully', inventory });
  } catch (err) {
    next(err);
  }
}

async function handleStockTransfer(req, res, next) {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity, remarks } = req.body;

    const result = await transferStock({
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity: Number(quantity),
      remarks,
      userId: req.user.id,
    });

    await logAudit({
      userId: req.user.id,
      action: 'STOCK_TRANSFER',
      entity: 'INVENTORY',
      entityId: productId,
      details: `Transferred ${quantity} units of product [${productId}] from warehouse [${fromWarehouseId}] to [${toWarehouseId}]`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Stock transferred successfully', result });
  } catch (err) {
    next(err);
  }
}

async function getWarehouses(req, res, next) {
  try {
    const warehouses = await prisma.warehouse.findMany({ orderBy: { isDefault: 'desc' } });
    res.json({ success: true, warehouses });
  } catch (err) {
    next(err);
  }
}

async function getMovements(req, res, next) {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: true,
        fromWarehouse: true,
        toWarehouse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, movements });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStockLevels,
  handleStockAdjustment,
  handleStockTransfer,
  getWarehouses,
  getMovements,
};
