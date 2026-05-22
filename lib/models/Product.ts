import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  images: [{ type: String }],
  brand: { type: String },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
