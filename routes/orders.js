const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

// Create new order (all authenticated users)
router.post('https://text-eau-backend.vercel.app/', auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdBy: req.user ? req.user.id : null // Will be set by auth middleware
    });
    await order.save();

    // Auto-create delivery for J+1 
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    const delivery = new Delivery({
      order: order._id,
      client: order.client,
      company: order.company,
      items: order.items.map(item => ({ article: item.article, quantity: item.quantity })),
      deliveryDate,
      createdBy: order.createdBy
    });
    await delivery.save();

    res.status(201).json({ order, delivery });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders (filtered by role/company)
router.get('https://text-eau-backend.vercel.app/', async (req, res) => {
  try {
    // TODO: Add role-based filtering
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one order
router.get('https://text-eau-backend.vercel.app/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
