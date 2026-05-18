const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const productController = require('../controllers/productController');

// Ruta para agregar productos (Solo Admin)
router.post('/', authMiddleware, adminMiddleware, productController.addProduct);

module.exports = router;