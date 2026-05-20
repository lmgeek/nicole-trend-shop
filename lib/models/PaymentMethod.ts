import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['bank_transfer', 'paypal', 'cash_on_delivery', 'card'] },
  enabled: { type: Boolean, default: true },
  description: { type: String },
  instructions: { type: String },
  config: { type: mongoose.Schema.Types.Mixed },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
