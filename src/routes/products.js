const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /products - Obtener todos los productos (público)
router.get('/', getAllProducts);

// GET /products/:id - Obtener producto por ID (público)
router.get('/:id', getProductById);

// Las siguientes rutas requieren autenticación
router.use(authenticate);

// POST /products - Crear producto (solo admin)
router.post('/', requireAdmin, createProduct);

// PUT /products/:id - Actualizar producto (solo admin)
router.put('/:id', requireAdmin, updateProduct);

// DELETE /products/:id - Eliminar producto (solo admin)
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;