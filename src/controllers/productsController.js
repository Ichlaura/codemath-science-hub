const Product = require('../models/Product');

// Obtener todos los productos
const getAllProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      type, 
      minAge, 
      maxAge,
      minPrice,
      maxPrice,
      search 
    } = req.query;
    
    const filter = { isActive: true };
    
    // Filtros
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (minAge || maxAge) {
      filter.$and = [];
      if (minAge) filter.$and.push({ 'ageRange.max': { $gte: parseInt(minAge) } });
      if (maxAge) filter.$and.push({ 'ageRange.min': { $lte: parseInt(maxAge) } });
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }
    
    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Obtener producto por ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'ID de producto inválido',
        code: 'INVALID_PRODUCT_ID'
      });
    }
    next(error);
  }
};

// Crear producto (solo admin)
const createProduct = async (req, res, next) => {
  try {
    // Verificar permisos de admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Se requieren permisos de administrador',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    const productData = req.body;
    
    // Validar rango de edades
    if (productData.ageRange && productData.ageRange.min > productData.ageRange.max) {
      return res.status(400).json({ 
        error: 'La edad mínima no puede ser mayor que la edad máxima',
        code: 'INVALID_AGE_RANGE'
      });
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Datos del producto inválidos',
        details: error.errors,
        code: 'VALIDATION_ERROR'
      });
    }
    next(error);
  }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Se requieren permisos de administrador',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Datos de actualización inválidos',
        details: error.errors,
        code: 'VALIDATION_ERROR'
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'ID de producto inválido',
        code: 'INVALID_PRODUCT_ID'
      });
    }
    next(error);
  }
};

// Eliminar producto (soft delete, solo admin)
const deleteProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Se requieren permisos de administrador',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    res.json({ 
      message: 'Producto eliminado exitosamente',
      product 
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        error: 'ID de producto inválido',
        code: 'INVALID_PRODUCT_ID'
      });
    }
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};