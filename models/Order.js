const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
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
    quantity: { type: Number, required: true },
    price: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'ready', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryDate: { type: Date }, // J+1
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  notes: String
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CMD-${new Date().getFullYear()}-${String(count + 1000).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
