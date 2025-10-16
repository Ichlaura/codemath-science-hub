const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../config/oauth');

let orders = []; // Array en memoria para almacenar órdenes

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, (req, res) => {
  res.json({ message: 'Orders retrieved successfully', orders });
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticateJWT, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found", code: "ORDER_NOT_FOUND" });
  res.json({ message: 'Order retrieved successfully', order });
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateJWT, (req, res) => {
  const { products: orderProducts } = req.body;
  if (!orderProducts || !Array.isArray(orderProducts) || orderProducts.length === 0) {
    return res.status(400).json({ error: "Products are required", code: "VALIDATION_ERROR" });
  }

  const newOrder = {
    id: Date.now().toString(),
    userId: req.user.id,
    products: orderProducts,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Order created successfully', order: newOrder });
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.put('/:id', authenticateJWT, (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) return res.status(404).json({ error: "Order not found", code: "ORDER_NOT_FOUND" });

  const updatedOrder = {
    ...orders[orderIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  orders[orderIndex] = updatedOrder;
  res.json({ message: 'Order updated successfully', order: updatedOrder });
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
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
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete('/:id', authenticateJWT, (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  if (orderIndex === -1) return res.status(404).json({ error: "Order not found", code: "ORDER_NOT_FOUND" });

  const deletedOrder = orders.splice(orderIndex, 1)[0];
  res.json({ message: 'Order deleted successfully', deletedOrder });
});

module.exports = router;
