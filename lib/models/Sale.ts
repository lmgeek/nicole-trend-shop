import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
}, { timestamps: true });

export const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
