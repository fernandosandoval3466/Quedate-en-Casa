const express = require('express');
const { getAllProducts, getProductById, searchProducts } = require('../controllers/productsController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

module.exports = router;
