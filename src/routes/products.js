const express = require("express");
const router = express.Router();

// Array en memoria para almacenar productos
let products = [
  {
    id: "1",
    name: "Math Adventure Game",
    category: "math",
    price: 9.99,
    type: "game"
  }
];

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all educational products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", (req, res) => {
  res.json({
    message: "Products retrieved successfully",
    products: products
  });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      error: "Product not found",
      code: "PRODUCT_NOT_FOUND"
    });
  }
  
  res.json({
    message: "Product retrieved successfully",
    product: product
  });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new educational product to the catalog
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [programming, math, physics]
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [game, app, book, course]
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", (req, res) => {
  const { name, category, price, type } = req.body;
  
  // Validación básica
  if (!name || !category || !price) {
    return res.status(400).json({
      error: "Missing required fields: name, category, price",
      code: "VALIDATION_ERROR"
    });
  }
  
  const newProduct = {
    id: Date.now().toString(), // ID único basado en timestamp
    name,
    category,
    price,
    type: type || "course",
    createdAt: new Date().toISOString()
  };
  
  // Agregar el nuevo producto al array
  products.push(newProduct);
  
  res.status(201).json({
    message: "Product created successfully",
    product: newProduct
  });
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product information
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: "Product not found",
      code: "PRODUCT_NOT_FOUND"
    });
  }
  
  // Actualizar el producto
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  products[productIndex] = updatedProduct;
  
  res.json({
    message: "Product updated successfully",
    product: updatedProduct
  });
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the catalog
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: "Product not found",
      code: "PRODUCT_NOT_FOUND"
    });
  }
  
  // Eliminar el producto
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: "Product deleted successfully",
    deletedProduct: deletedProduct
  });
});

module.exports = router;