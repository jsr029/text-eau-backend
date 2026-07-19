const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to check superAdmin
const superAdminOnly = (req, res, next) => {
  if (req.user.role !== 'superAdmin') {
    return res.status(403).json({ message: 'Accès réservé aux superAdmins' });
  }
  next();
};

// GET all users (superAdmin only)
router.get('/', auth, superAdminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Create user
router.post('/', auth, superAdminOnly, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update role
router.put('/:id/role', auth, superAdminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
