const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');
const { logAudit } = require('../services/auditService');

async function getProducts(req, res, next) {
  try {
    const { search, categoryId, page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      deletedAt: null,
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { barcode: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          category: true,
          inventories: { include: { warehouse: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate aggregate total stock per product
    const formattedProducts = products.map((prod) => {
      const totalStock = prod.inventories.reduce((acc, inv) => acc + inv.quantity, 0);
      let stockStatus = 'IN_STOCK';
      if (totalStock === 0) stockStatus = 'OUT_OF_STOCK';
      else if (totalStock <= prod.minStockAlert) stockStatus = 'LOW_STOCK';

      return {
        ...prod,
        totalStock,
        stockStatus,
      };
    });

    res.json({
      success: true,
      data: formattedProducts,
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

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventories: { include: { warehouse: true } },
        movements: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!product || product.deletedAt) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const totalStock = product.inventories.reduce((acc, inv) => acc + inv.quantity, 0);
    res.json({ success: true, product: { ...product, totalStock } });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { sku, barcode, name, description, categoryId, purchasePrice, sellingPrice, gstRate, minStockAlert } = req.body;

    let imageUrl = null;
    if (req.file) {
      // Stream buffer to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      try {
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: 'erp-products' });
        imageUrl = uploadRes.secure_url;
      } catch (uploadErr) {
        imageUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60';
      }
    }

    const product = await prisma.product.create({
      data: {
        sku,
        barcode,
        name,
        description,
        categoryId,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        gstRate: gstRate ? Number(gstRate) : 18.00,
        minStockAlert: minStockAlert ? Number(minStockAlert) : 10,
        imageUrl,
      },
      include: { category: true },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_PRODUCT',
      entity: 'PRODUCT',
      entityId: product.id,
      details: `Created SKU [${product.sku}] - ${product.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.purchasePrice) data.purchasePrice = Number(data.purchasePrice);
    if (data.sellingPrice) data.sellingPrice = Number(data.sellingPrice);
    if (data.gstRate) data.gstRate = Number(data.gstRate);
    if (data.minStockAlert) data.minStockAlert = Number(data.minStockAlert);

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      try {
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: 'erp-products' });
        data.imageUrl = uploadRes.secure_url;
      } catch (uploadErr) {}
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json({ success: true, message: 'Product soft deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
