const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../config/oauth');

let reviews = []; // Array en memoria para almacenar reviews

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
  res.json({ message: 'Reviews retrieved successfully', reviews });
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
  const review = reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found", code: "REVIEW_NOT_FOUND" });
  res.json({ message: 'Review retrieved successfully', review });
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
 *         description: List of reviews for a product
 *       404:
 *         description: No reviews found for this product
 */
router.get('/product/:productId', (req, res) => {
  const productReviews = reviews.filter(r => r.product === req.params.productId);
  if (productReviews.length === 0) return res.status(404).json({ error: "No reviews found for this product", code: "REVIEWS_NOT_FOUND" });
  res.json({ message: 'Reviews retrieved successfully', reviews: productReviews });
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
  const { product, rating, comment } = req.body;
  if (!product || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields", code: "VALIDATION_ERROR" });
  }

  const newReview = {
    id: Date.now().toString(),
    userId: req.user.id,
    product,
    rating,
    comment,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  res.status(201).json({ message: 'Review created successfully', review: newReview });
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
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
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.put('/:id', authenticateJWT, (req, res) => {
  const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
  if (reviewIndex === -1) return res.status(404).json({ error: "Review not found", code: "REVIEW_NOT_FOUND" });

  const updatedReview = {
    ...reviews[reviewIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  reviews[reviewIndex] = updatedReview;
  res.json({ message: 'Review updated successfully', review: updatedReview });
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
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
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authenticateJWT, (req, res) => {
  const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
  if (reviewIndex === -1) return res.status(404).json({ error: "Review not found", code: "REVIEW_NOT_FOUND" });

  const deletedReview = reviews.splice(reviewIndex, 1)[0];
  res.json({ message: 'Review deleted successfully', deletedReview });
});

module.exports = router;
