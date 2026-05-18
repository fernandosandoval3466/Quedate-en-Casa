const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Todas las rutas del carrito requieren autenticación
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/:productId', cartController.removeFromCart);
router.put('/:productId', cartController.updateCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;