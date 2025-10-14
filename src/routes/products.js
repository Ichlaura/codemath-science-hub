const express = require("express");
const router = express.Router();

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
    products: [
      {
        id: "1",
        name: "Math Adventure Game",
        category: "math",
        price: 9.99,
        type: "game"
      }
    ]
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
  res.json({
    message: "Product retrieved successfully",
    product: { 
      id: req.params.id, 
      name: "Sample Product",
      category: "programming",
      price: 19.99,
      type: "course"
    }
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
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
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
  res.json({
    message: "Product updated successfully",
    product: {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    }
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
  res.json({
    message: "Product deleted successfully",
    deletedId: req.params.id
  });
});

module.exports = router;
