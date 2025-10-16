const User = require('../models/User');

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    
    const users = await User.find(filter)
      .select('-googleId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'ID de usuario inválido',
        code: 'INVALID_USER_ID'
      });
    }
    next(error);
  }
};

// Actualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { name, children, profilePicture } = req.body;
    
    // Validar que el usuario solo pueda actualizar sus propios datos
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'No tienes permiso para actualizar este usuario',
        code: 'FORBIDDEN'
      });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (children) updateData.children = children;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-googleId');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Datos de actualización inválidos',
        details: error.errors,
        code: 'VALIDATION_ERROR'
      });
    }
    next(error);
  }
};

// Eliminar usuario (soft delete)
const deleteUser = async (req, res, next) => {
  try {
    // Solo admins pueden eliminar usuarios
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Se requieren permisos de administrador',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-googleId');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({ 
      message: 'Usuario desactivado exitosamente',
      user 
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'ID de usuario inválido',
        code: 'INVALID_USER_ID'
      });
    }
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};