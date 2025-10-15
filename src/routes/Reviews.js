const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../config/oauth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, (req, res) => {
  res.json({ message: 'Get all reviews - protected' });
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.get('/:id', authenticateJWT, (req, res) => {
  res.json({ message: 'Get review by ID - protected', id: req.params.id });
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - rating
 *               - comment
 *             properties:
 *               product:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateJWT, (req, res) => {
  res.status(201).json({ message: 'Create review - protected' });
});

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     summary: Get reviews by product (public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of product reviews
 *       404:
 *         description: Product not found
 */
router.get('/product/:productId', (req, res) => {
  res.json({ message: 'Get reviews by product - public', productId: req.params.productId });
});

module.exports = router;