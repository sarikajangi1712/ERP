const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getDashboardStats(req, res, next) {
  try {
    const [
      totalCustomers,
      totalProducts,
      inventories,
      confirmedChallans,
      invoices,
      pendingChallansCount,
      lowStockProducts,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.inventory.findMany({
        where: { product: { deletedAt: null } },
        include: { product: true },
      }),
      prisma.salesChallan.findMany({ where: { status: 'CONFIRMED' } }),
      prisma.invoice.findMany(),
      prisma.salesChallan.count({ where: { status: 'DRAFT' } }),
      prisma.product.findMany({
        where: { deletedAt: null },
        include: { inventories: true },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, role: true } } },
      }),
    ]);

    // Total Inventory Value
    const inventoryValue = inventories.reduce((acc, inv) => {
      return acc + Number(inv.product.purchasePrice) * inv.quantity;
    }, 0);

    // Sales & Revenue Calculations
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySales = confirmedChallans
      .filter((c) => c.createdAt.toISOString().slice(0, 10) === todayStr)
      .reduce((acc, c) => acc + Number(c.grandTotal), 0);

    const totalRevenue = invoices
      .filter((i) => i.paymentStatus === 'PAID')
      .reduce((acc, i) => acc + Number(i.paidAmount), 0);

    // Low stock count
    const lowStockCount = lowStockProducts.filter((p) => {
      const stock = p.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      return stock <= p.minStockAlert;
    }).length;

    // Monthly Sales Trend Data (Last 6 Months)
    const monthlySales = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - idx));
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const monthNum = d.getMonth();
      const yearNum = d.getFullYear();

      const total = confirmedChallans
        .filter((c) => {
          const cDate = new Date(c.createdAt);
          return cDate.getMonth() === monthNum && cDate.getFullYear() === yearNum;
        })
        .reduce((sum, c) => sum + Number(c.grandTotal), 0);

      return { month: monthLabel, sales: total };
    });

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalProducts,
        inventoryValue,
        todaySales,
        totalRevenue,
        pendingChallansCount,
        lowStockCount,
        unpaidInvoicesCount: invoices.filter((i) => i.paymentStatus !== 'PAID').length,
      },
      charts: {
        monthlySales,
      },
      recentActivity: recentAuditLogs,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
