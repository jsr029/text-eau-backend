const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Auto Delivery J+1
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    const delivery = new Delivery({
      order: order._id,
      client: order.client,
      company: order.company,
      items: order.items,
      deliveryDate
    });
    await delivery.save();

    res.status(201).json({ order, delivery });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get('/', auth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// READ ONE
router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
  res.json(order);
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Commande supprimée' });
});

module.exports = router;