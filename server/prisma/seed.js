require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean existing records (Optional safety)
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.salesChallanItem.deleteMany({});
  await prisma.salesChallan.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.warehouse.deleteMany({});
  await prisma.customerNote.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@erp.com',
      password: hashedPassword,
      name: 'Alexander Pierce (System Admin)',
      role: 'ADMIN',
      phone: '+91 98765 43210',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@erp.com',
      password: hashedPassword,
      name: 'Sarah Jenkins (Sales Exec)',
      role: 'SALES',
      phone: '+91 98765 43211',
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      email: 'warehouse@erp.com',
      password: hashedPassword,
      name: 'Marcus Vance (Warehouse Manager)',
      role: 'WAREHOUSE',
      phone: '+91 98765 43212',
    },
  });

  const accountsUser = await prisma.user.create({
    data: {
      email: 'accounts@erp.com',
      password: hashedPassword,
      name: 'Elena Rostova (Accounts Lead)',
      role: 'ACCOUNTS',
      phone: '+91 98765 43213',
    },
  });

  console.log('✅ Users seeded: admin@erp.com, sales@erp.com, warehouse@erp.com, accounts@erp.com (Password: Password123!)');

  // 3. Warehouses
  const mainWh = await prisma.warehouse.create({
    data: {
      code: 'WH-MAIN',
      name: 'Central Distribution Warehouse',
      address: 'Plot 45, Industrial Logistics Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      isDefault: true,
    },
  });

  const transitWh = await prisma.warehouse.create({
    data: {
      code: 'WH-NORTH',
      name: 'North Region Depot',
      address: 'Sector 62, Logistics Complex',
      city: 'Gurugram',
      state: 'Haryana',
      isDefault: false,
    },
  });

  console.log('✅ Warehouses seeded: Central & North Depots');

  // 4. Categories & Products
  const electronicsCat = await prisma.category.create({
    data: { name: 'Industrial Electronics', description: 'Power units, sensors, and controllers' },
  });

  const hardwareCat = await prisma.category.create({
    data: { name: 'Hardware & Tools', description: 'Fasteners, valves, and precision tools' },
  });

  const products = [
    {
      sku: 'SKU-ELEC-101',
      barcode: '8901234567890',
      name: 'Industrial Power Supply 24V 10A',
      description: 'DIN-rail mounted switching power supply for industrial panels',
      categoryId: electronicsCat.id,
      purchasePrice: 2800.00,
      sellingPrice: 4200.00,
      gstRate: 18.00,
      minStockAlert: 15,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    },
    {
      sku: 'SKU-ELEC-102',
      barcode: '8901234567891',
      name: 'Digital Programmable Logic Controller (PLC)',
      description: '16 Input / 12 Relay Output High Speed Controller',
      categoryId: electronicsCat.id,
      purchasePrice: 12500.00,
      sellingPrice: 18900.00,
      gstRate: 18.00,
      minStockAlert: 5,
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=60',
    },
    {
      sku: 'SKU-HARD-201',
      barcode: '8901234567892',
      name: 'Stainless Steel Ball Valve 2 Inch',
      description: '316 Grade Heavy Duty Flanged Ball Valve',
      categoryId: hardwareCat.id,
      purchasePrice: 1500.00,
      sellingPrice: 2400.00,
      gstRate: 18.00,
      minStockAlert: 20,
      imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=500&auto=format&fit=crop&q=60',
    },
    {
      sku: 'SKU-HARD-202',
      barcode: '8901234567893',
      name: 'High Precision Laser Distance Meter 100m',
      description: 'IP54 Waterproof Industrial Distance Measurement Sensor',
      categoryId: hardwareCat.id,
      purchasePrice: 3200.00,
      sellingPrice: 5100.00,
      gstRate: 18.00,
      minStockAlert: 8,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60',
    },
  ];

  const createdProducts = [];
  for (const prod of products) {
    const p = await prisma.product.create({ data: prod });
    createdProducts.push(p);

    // Initial Inventory
    await prisma.inventory.create({
      data: {
        productId: p.id,
        warehouseId: mainWh.id,
        quantity: p.sku === 'SKU-ELEC-102' ? 4 : 85, // Low stock for PLC
      },
    });

    await prisma.inventory.create({
      data: {
        productId: p.id,
        warehouseId: transitWh.id,
        quantity: 30,
      },
    });
  }

  console.log('✅ Categories & Products seeded');

  // 5. Customers
  const customer1 = await prisma.customer.create({
    data: {
      companyName: 'Apex Automation & Robotics Ltd',
      contactPerson: 'Rahul Sharma',
      email: 'contact@apexauto.com',
      phone: '+91 98200 11223',
      gstNumber: '27AAACA12341Z5',
      address: 'Plot 12, SEZ Electronic Zone',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      leadStatus: 'ACTIVE',
      creditLimit: 500000.00,
      notes: {
        create: [
          {
            userId: salesUser.id,
            note: 'Discussed annual maintenance contract for power units. Customer requested 5% bulk discount.',
            nextFollowUp: new Date(Date.now() + 86400000 * 3), // 3 days later
          },
        ],
      },
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyName: 'Titanium Engineering Works',
      contactPerson: 'Vikramaditya Rao',
      email: 'procurement@titaniumeng.com',
      phone: '+91 98111 44556',
      gstNumber: '07BBBCT98761Z2',
      address: 'Industrial Estate Phase 3',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110020',
      leadStatus: 'LEAD',
      creditLimit: 250000.00,
      notes: {
        create: [
          {
            userId: salesUser.id,
            note: 'Sent formal quotation for 50 SS Ball Valves.',
            nextFollowUp: new Date(Date.now() + 86400000), // Tomorrow
          },
        ],
      },
    },
  });

  console.log('✅ Customers & Notes seeded');

  // 6. Sales Challan & Invoice
  const challan = await prisma.salesChallan.create({
    data: {
      challanNumber: 'CHAL-20260722-0001',
      customerId: customer1.id,
      warehouseId: mainWh.id,
      createdById: salesUser.id,
      status: 'CONFIRMED',
      subTotal: 8400.00,
      taxAmount: 1512.00,
      discountAmount: 0.00,
      grandTotal: 9912.00,
      notes: 'Urgent delivery via Express Freight',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            unitPrice: 4200.00,
            gstRate: 18.00,
            quantity: 2,
            subTotal: 8400.00,
            taxAmount: 1512.00,
            totalAmount: 9912.00,
          },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20260722-0001',
      challanId: challan.id,
      customerId: customer1.id,
      paymentStatus: 'PAID',
      subTotal: 8400.00,
      taxAmount: 1512.00,
      discountAmount: 0.00,
      grandTotal: 9912.00,
      paidAmount: 9912.00,
      dueDate: new Date(Date.now() + 86400000 * 30),
      notes: 'Paid via NEFT Transfer Ref #TXN99281',
      items: {
        create: [
          {
            description: createdProducts[0].name,
            unitPrice: 4200.00,
            quantity: 2,
            gstRate: 18.00,
            totalAmount: 9912.00,
          },
        ],
      },
    },
  });

  console.log('✅ Sales Challan & Invoice seeded');

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_SEED',
      entity: 'DATABASE',
      details: 'Populated initial system seed data for production environment',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
