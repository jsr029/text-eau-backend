const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryNumber: { 
    type: String, 
    unique: true 
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  client: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  items: [{
    article: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { 
    type: String, 
    enum: ['scheduled', 'in_transit', 'delivered', 'failed'], 
    default: 'scheduled' 
  },
  deliveryDate: { 
    type: Date, 
    required: true 
  },
  driver: String,
  signature: String,
  notes: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

// Auto-generate deliveryNumber - Version robuste
deliverySchema.pre('save', async function(next) {
  if (this.deliveryNumber) return next();

  try {
    const count = await mongoose.model('Delivery').countDocuments();
    const year = new Date().getFullYear();
    const sequence = (count + 1).toString().padStart(4, '0');
    this.deliveryNumber = `LIV-${year}-${sequence}`;
  } catch (err) {
    console.error('Error generating deliveryNumber:', err);
    // Fallback
    this.deliveryNumber = `LIV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);