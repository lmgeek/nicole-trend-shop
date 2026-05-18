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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

clientSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Client = mongoose.model('Client', clientSchema);
