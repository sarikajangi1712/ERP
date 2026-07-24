const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');

async function adjustStock({ productId, warehouseId, quantity, type, remarks, userId }) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get or create inventory record
    let inventory = await tx.inventory.findUnique({
      where: {
        productId_warehouseId: { productId, warehouseId },
      },
    });

    if (!inventory) {
      inventory = await tx.inventory.create({
        data: {
          productId,
          warehouseId,
          quantity: 0,
        },
      });
    }

    const currentQty = inventory.quantity;
    let newQty = currentQty;

    if (type === 'STOCK_IN') {
      newQty = currentQty + quantity;
    } else if (type === 'STOCK_OUT') {
      if (currentQty < quantity) {
        throw new Error(`Insufficient stock. Current stock is ${currentQty}, requested reduction is ${quantity}.`);
      }
      newQty = currentQty - quantity;
    } else {
      throw new Error(`Invalid stock movement type: ${type}`);
    }

    // 2. Update inventory balance
    const updatedInventory = await tx.inventory.update({
      where: { id: inventory.id },
      data: { quantity: newQty },
    });

    // 3. Record movement log
    await tx.stockMovement.create({
      data: {
        productId,
        type,
        quantity,
        [type === 'STOCK_IN' ? 'toWarehouseId' : 'fromWarehouseId']: warehouseId,
        remarks,
        createdById: userId,
      },
    });

    // 4. Check low stock threshold
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (product && newQty <= product.minStockAlert) {
      await createNotification({
        userId,
        title: '⚠️ Low Stock Alert',
        message: `Product [${product.name}] (SKU: ${product.sku}) stock level in warehouse has dropped to ${newQty} (Alert Threshold: ${product.minStockAlert})`,
        type: 'WARNING',
        link: '/inventory',
      });
    }

    return updatedInventory;
  });
}

async function transferStock({ productId, fromWarehouseId, toWarehouseId, quantity, remarks, userId }) {
  if (fromWarehouseId === toWarehouseId) {
    throw new Error('Source and destination warehouses cannot be the same.');
  }

  return await prisma.$transaction(async (tx) => {
    // Check source stock
    const sourceInv = await tx.inventory.findUnique({
      where: { productId_warehouseId: { productId, warehouseId: fromWarehouseId } },
    });

    if (!sourceInv || sourceInv.quantity < quantity) {
      const avail = sourceInv ? sourceInv.quantity : 0;
      throw new Error(`Insufficient source stock. Available: ${avail}, Requested: ${quantity}`);
    }

    // Deduct from source
    await tx.inventory.update({
      where: { id: sourceInv.id },
      data: { quantity: sourceInv.quantity - quantity },
    });

    // Credit destination
    let destInv = await tx.inventory.findUnique({
      where: { productId_warehouseId: { productId, warehouseId: toWarehouseId } },
    });

    if (!destInv) {
      destInv = await tx.inventory.create({
        data: { productId, warehouseId: toWarehouseId, quantity: 0 },
      });
    }

    await tx.inventory.update({
      where: { id: destInv.id },
      data: { quantity: destInv.quantity + quantity },
    });

    // Record movement
    await tx.stockMovement.create({
      data: {
        productId,
        type: 'TRANSFER',
        quantity,
        fromWarehouseId,
        toWarehouseId,
        remarks,
        createdById: userId,
      },
    });

    return { success: true, message: 'Stock transferred successfully' };
  });
}

module.exports = { adjustStock, transferStock };
