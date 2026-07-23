const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSettings(req, res, next) {
  try {
    const settings = await prisma.systemSetting.findMany();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

async function updateSetting(req, res, next) {
  try {
    const { key, value, description } = req.body;
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });

    res.json({ success: true, setting });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSetting };
