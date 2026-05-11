const express = require('express');
const { getCart, addToCart, removeFromCart, updateCart, clearCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.put('/update/:productId', updateCart);
router.delete('/clear', clearCart);

module.exports = router;
