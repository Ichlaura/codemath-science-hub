const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Error de validación de MongoDB
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Error de validación',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Error de duplicado de MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: `${field} ya existe`,
      code: 'DUPLICATE_ENTRY'
    });
  }

  // Error de cast de MongoDB (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      code: 'INVALID_ID'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR'
  });
};

module.exports = errorHandler;