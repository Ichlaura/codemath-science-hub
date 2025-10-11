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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", (req, res) => {
  res.json({
    message: "Products retrieved successfully",
    products: []
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
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", (req, res) => {
  res.json({
    message: "Product retrieved successfully",
    product: { id: req.params.id, name: "Sample Product" }
  });
});

module.exports = router;
