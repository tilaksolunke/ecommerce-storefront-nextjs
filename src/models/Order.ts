// import mongoose from 'mongoose';

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   image: String
// });

// const orderSchema = new mongoose.Schema({
//   orderNumber: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   items: [orderItemSchema],
//   shippingAddress: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     zipCode: { type: String, required: true },
//     country: { type: String, required: true },
//     phone: String
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['credit_card', 'paypal', 'stripe', 'cash_on_delivery'],
//     default: 'credit_card'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   orderStatus: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   subtotal: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   tax: {
//     type: Number,
//     default: 0
//   },
//   shipping: {
//     type: Number,
//     default: 0
//   },
//   total: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   notes: String,
//   trackingNumber: String,
//   estimatedDelivery: Date
// }, {
//   timestamps: true
// });

// // Generate order number
// orderSchema.pre('save', async function(next) {
//   if (this.isNew) {
//     const count = await mongoose.model('Order').countDocuments();
//     this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
//   }
//   next();
// });

// export default mongoose.models.Order || mongoose.model('Order', orderSchema);


// src/models/Order.ts
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

// src/models/Order.ts - Add these fields if not already present
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    id: String,
    email: { type: String, required: true },
    name: String
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    default: 'stripe'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripeSessionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripePaymentIntentId: {
    type: String,
    unique: true,
    sparse: true
  }
}, { 
  timestamps: true 
});


export default mongoose.models.Order || mongoose.model('Order', orderSchema);
