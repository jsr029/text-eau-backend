const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// PayPal simulation (replace with real SDK in production)
router.post('/create-paypal-order', async (req, res) => {
  const { orderId, amount } = req.body;
  
  // In real: call PayPal API
  const paypalOrderId = "PAYPAL_" + Date.now();

  await Order.findByIdAndUpdate(orderId, { 
    paymentStatus: 'pending', 
    paymentMethod: 'paypal' 
  });

  res.json({
    id: paypalOrderId,
    status: "CREATED",
    approveLink: `https://www.sandbox.paypal.com/checkout?order=${paypalOrderId}`
  });
});

router.post('/capture-paypal-order', async (req, res) => {
  const { orderId } = req.body;
  
  await Order.findByIdAndUpdate(orderId, { 
    paymentStatus: 'paid', 
    paidAt: new Date() 
  });

  res.json({ success: true, message: 'Paiement PayPal + CB confirmé avec succès !' });
});

module.exports = router;