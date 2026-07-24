const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateCSV } = require('../utils/csvExporter');
const { logAudit } = require('../services/auditService');

async function getCustomers(req, res, next) {
  try {
    const { search, leadStatus, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      deletedAt: null,
      ...(leadStatus && { leadStatus }),
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactPerson: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { gstNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { challans: true, invoices: true, notes: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: customers,
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

async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        notes: {
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
        challans: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer || customer.deletedAt) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, customer });
  } catch (err) {
    next(err);
  }
}

async function createCustomer(req, res, next) {
  try {
    const { companyName, contactPerson, email, phone, gstNumber, address, city, state, pincode, leadStatus, creditLimit } = req.body;

    const existing = await prisma.customer.findFirst({
      where: { email, deletedAt: null },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'A customer with this email already exists' });
    }

    const customer = await prisma.customer.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        gstNumber,
        address,
        city,
        state,
        pincode,
        leadStatus: leadStatus || 'PROSPECT',
        creditLimit: creditLimit ? Number(creditLimit) : 0,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_CUSTOMER',
      entity: 'CUSTOMER',
      entityId: customer.id,
      details: `Created customer [${customer.companyName}]`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, customer });
  } catch (err) {
    next(err);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.customer.update({
      where: { id },
      data,
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_CUSTOMER',
      entity: 'CUSTOMER',
      entityId: id,
      details: `Updated customer details for [${updated.companyName}]`,
      ipAddress: req.ip,
    });

    res.json({ success: true, customer: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_CUSTOMER',
      entity: 'CUSTOMER',
      entityId: id,
      details: `Soft deleted customer record [${id}]`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Customer soft deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function addNote(req, res, next) {
  try {
    const { id } = req.params;
    const { note, nextFollowUp } = req.body;

    const newNote = await prisma.customerNote.create({
      data: {
        customerId: id,
        userId: req.user.id,
        note,
        nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    next(err);
  }
}

async function exportCSV(req, res, next) {
  try {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      { label: 'Company Name', key: 'companyName' },
      { label: 'Contact Person', key: 'contactPerson' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'GSTIN', key: 'gstNumber' },
      { label: 'City', key: 'city' },
      { label: 'State', key: 'state' },
      { label: 'Status', key: 'leadStatus' },
      { label: 'Credit Limit', key: 'creditLimit' },
    ];

    const csvContent = generateCSV(customers, headers);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers-export.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addNote,
  exportCSV,
};
