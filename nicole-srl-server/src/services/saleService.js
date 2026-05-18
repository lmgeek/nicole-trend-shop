import { Sale } from '../models/Sale.js';

export const findAll = async () => Sale.find().sort({ createdAt: -1 });

export const findById = async (id) => Sale.findById(id);

export const create = async (data) => {
  const sale = new Sale(data);
  await sale.save();
  return sale;
};

export const update = async (id, data) => Sale.findByIdAndUpdate(id, data, { new: true });

export const remove = async (id) => Sale.findByIdAndDelete(id);
