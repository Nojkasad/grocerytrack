const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const authMiddleware = require('../middleware/auth');
// GET /prices
router.get('/', async (req, res) => {
  const { productId } = req.query;
  try {
    const prices = await prisma.priceEntry.findMany({
      where: productId ? { productId: parseInt(productId) } : {},
      orderBy: { dateSeen: 'desc' },
    });
    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// POST /prices
router.post('/', authMiddleware, async (req, res) => {
  const { price, storeName, productId } = req.body;
  const userId = req.user.userId; // from token, not body

  if (price == null || !storeName || productId == null) {
    return res.status(400).json({
      error: 'price, storeName and productId are required',
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPrice = await prisma.priceEntry.create({
      data: {
        price: Number(price),
        storeName: storeName.trim(),
        productId: Number(productId),
        userId: Number(userId),
      },
    });

    res.status(201).json(newPrice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create price entry' });
  }
});

module.exports = router;