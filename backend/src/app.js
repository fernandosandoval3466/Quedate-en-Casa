require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // En desarrollo, permitimos todo para diagnosticar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de peticiones para ver si llegan al servidor
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Asegúrate de que esta línea ya esté
const adminProductRoutes = require('./routes/adminProductRoutes'); // Nueva línea

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes); // Asegúrate de que esta línea ya esté
app.use('/api/admin/products', adminProductRoutes); // Nueva línea

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
