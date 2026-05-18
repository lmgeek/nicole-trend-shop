import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  type: { type: String, enum: ['product', 'custom'], required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonLink: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

heroSlideSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
