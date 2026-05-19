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
}, { timestamps: true });

export const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);
