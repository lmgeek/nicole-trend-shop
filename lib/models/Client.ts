import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Italia' },
  },
  notes: { type: String },
  totalPurchases: { type: Number, default: 0 },
}, { timestamps: true });

export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
