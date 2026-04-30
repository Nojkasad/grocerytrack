const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const pricesRoutes = require ('./routes/prices');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/prices',pricesRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'GroceryTrack API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});