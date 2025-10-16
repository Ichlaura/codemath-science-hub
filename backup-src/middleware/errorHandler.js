const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: "Validation error",
      details: errors,
      code: "VALIDATION_ERROR"
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: field + " already exists",
      code: "DUPLICATE_ENTRY"
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID",
      code: "INVALID_ID"
    });
  }

  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_SERVER_ERROR"
  });
};

module.exports = errorHandler;
