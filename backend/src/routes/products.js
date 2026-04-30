const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// GET /products
router.get('/', async (req, res) => {
  const search =
    typeof req.query.search === 'string' ? req.query.search.trim() : '';

  try {
    const products = await prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /products
router.post('/', async (req, res) => {
  let { name, category, barcode } = req.body;

  name = typeof name === 'string' ? name.trim() : '';
  category = typeof category === 'string' ? category.trim() : null;
  barcode = typeof barcode === 'string' ? barcode.trim() : null;

  if (!name) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  if (category === '') category = null;
  if (barcode === '') barcode = null;

  try {
    const product = await prisma.product.create({
      data: { name, category, barcode },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /products/:id/prices
router.get('/:id/prices', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  try {
    const prices = await prisma.priceEntry.findMany({
      where: { productId: id },
      orderBy: { dateSeen: 'desc' },
    });

    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

module.exports = router;