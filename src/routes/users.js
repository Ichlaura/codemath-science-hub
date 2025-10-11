const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../controllers/usersController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /users - Obtener todos los usuarios (solo admin)
router.get('/', requireAdmin, getAllUsers);

// GET /users/:id - Obtener usuario por ID
router.get('/:id', getUserById);

// PUT /users/:id - Actualizar usuario
router.put('/:id', updateUser);

// DELETE /users/:id - Eliminar usuario (solo admin)
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;