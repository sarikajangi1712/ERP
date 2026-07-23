const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');

async function generateChallanNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.salesChallan.count();
  const seq = String(count + 1).padStart(4, '0');
  return `CHAL-${dateStr}-${seq}`;
}

async function createDraftChallan({ customerId, warehouseId, items, discountAmount = 0, notes, userId }) {
  let subTotal = 0;
  let taxAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    const unitPrice = Number(product.sellingPrice);
    const gstRate = Number(product.gstRate);
    const itemSubTotal = unitPrice * item.quantity;
    const itemTax = (itemSubTotal * gstRate) / 100;
    const itemTotal = itemSubTotal + itemTax;

    subTotal += itemSubTotal;
    taxAmount += itemTax;

    processedItems.push({
      productId: item.productId,
      unitPrice,
      gstRate,
      quantity: item.quantity,
      subTotal: itemSubTotal,
      taxAmount: itemTax,
      totalAmount: itemTotal,
    });
  }

  const grandTotal = subTotal + taxAmount - Number(discountAmount);
  const challanNumber = await generateChallanNumber();

  return await prisma.salesChallan.create({
    data: {
      challanNumber,
      customerId,
      warehouseId,
      createdById: userId,
      status: 'DRAFT',
      subTotal,
      taxAmount,
      discountAmount,
      grandTotal,
      notes,
      items: {
        create: processedItems,
      },
    },
    include: {
      customer: true,
      warehouse: true,
      items: { include: { product: true } },
    },
  });
}

async function confirmChallan(challanId, userId) {
  return await prisma.$transaction(async (tx) => {
    const challan = await tx.salesChallan.findUnique({
      where: { id: challanId },
      include: { items: true, customer: true },
    });

    if (!challan) throw new Error('Sales challan not found');
    if (challan.status !== 'DRAFT') throw new Error(`Cannot confirm challan with status: ${challan.status}`);

    // 1. Verify and deduct stock for each item
    for (const item of challan.items) {
      const inv = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId: item.productId,
            warehouseId: challan.warehouseId,
          },
        },
      });

      const currentStock = inv ? inv.quantity : 0;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId} in selected warehouse. Available: ${currentStock}, Required: ${item.quantity}`);
      }

      // Deduct stock
      await tx.inventory.update({
        where: { id: inv.id },
        data: { quantity: currentStock - item.quantity },
      });

      // Record movement
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'CHALLAN_DEDUCTION',
          quantity: item.quantity,
          fromWarehouseId: challan.warehouseId,
          reference: challan.challanNumber,
          remarks: `Stock deducted for confirmed Sales Challan ${challan.challanNumber}`,
          createdById: userId,
        },
      });
    }

    // 2. Lock status
    const confirmedChallan = await tx.salesChallan.update({
      where: { id: challanId },
      data: { status: 'CONFIRMED' },
      include: { items: { include: { product: true } }, customer: true, warehouse: true },
    });

    // 3. Trigger Notification
    await createNotification({
      userId,
      title: '📦 Sales Challan Confirmed',
      message: `Challan ${confirmedChallan.challanNumber} for ${confirmedChallan.customer.companyName} confirmed & stock deducted.`,
      type: 'SUCCESS',
      link: `/challans/${challanId}`,
    });

    return confirmedChallan;
  });
}

async function cancelChallan(challanId, userId) {
  return await prisma.$transaction(async (tx) => {
    const challan = await tx.salesChallan.findUnique({
      where: { id: challanId },
      include: { items: true, customer: true },
    });

    if (!challan) throw new Error('Sales challan not found');
    if (challan.status === 'CANCELLED') throw new Error('Challan is already cancelled');

    // If it was confirmed, restore stock
    if (challan.status === 'CONFIRMED') {
      for (const item of challan.items) {
        const inv = await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId: item.productId,
              warehouseId: challan.warehouseId,
            },
          },
        });

        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: { quantity: inv.quantity + item.quantity },
          });
        }

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'CHALLAN_RESTORE',
            quantity: item.quantity,
            toWarehouseId: challan.warehouseId,
            reference: challan.challanNumber,
            remarks: `Stock restored from cancelled Sales Challan ${challan.challanNumber}`,
            createdById: userId,
          },
        });
      }
    }

    const cancelledChallan = await tx.salesChallan.update({
      where: { id: challanId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { product: true } }, customer: true },
    });

    return cancelledChallan;
  });
}

module.exports = { createDraftChallan, confirmChallan, cancelChallan };
