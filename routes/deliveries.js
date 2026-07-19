const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('order').sort({ deliveryDate: 1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get one delivery
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('order');
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
