const Order = require('../models/Order');
const Product = require('../models/Product');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product', 'name price image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price description');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST new order
const createOrder = async (req, res) => {
  try {
    const { user, products } = req.body;
    
    // Validación
    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'User and products are required' });
    }

    // Calcular total y verificar productos
    let totalAmount = 0;
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1' });
      }
      totalAmount += product.price * item.quantity;
      item.price = product.price; // Guardar precio al momento de la compra
    }

    const newOrder = new Order({
      user,
      products,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    await savedOrder.populate('products.product', 'name price');
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const validStatuses = ['pending', 'completed', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('products.product', 'name price');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};