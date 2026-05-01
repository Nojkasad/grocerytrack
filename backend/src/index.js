const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const priceEntryRoutes = require('./routes/prices');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/prices', priceEntryRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GroceryTrack API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});