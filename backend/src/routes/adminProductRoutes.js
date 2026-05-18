const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/adminProductController');
const { verifyToken, isAdmin } = require('./authMiddleware');

// Todas estas rutas requieren Token y ser Administrador
router.post('/', verifyToken, isAdmin, adminProductController.addProduct);
router.put('/:id', verifyToken, isAdmin, adminProductController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, adminProductController.deleteProduct);

module.exports = router;