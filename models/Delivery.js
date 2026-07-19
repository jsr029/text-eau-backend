const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryNumber: { 
    type: String, 
    required: true, 
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
  signature: String, // URL or base64
  notes: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

// Auto-generate delivery number
deliverySchema.pre('save', async function(next) {
  if (!this.deliveryNumber) {
    const count = await mongoose.model('Delivery').countDocuments();
    this.deliveryNumber = `LIV-${new Date().getFullYear()}-${String(count + 1000).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);
