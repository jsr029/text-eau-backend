const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
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
    price: { type: Number, default: 0 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'ready', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryDate: { type: Date },
  paymentStatus: { type: String, default: 'unpaid' },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

// Auto-generate orderNumber BEFORE save
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments() + 1;
    const year = new Date().getFullYear();
    this.orderNumber = `CMD-${year}-${count.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);