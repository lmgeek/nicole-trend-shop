import { Category } from '../models/Category.js';

export const findAll = async () => Category.find().sort({ name: 1 });

export const findById = async (id) => Category.findById(id);

export const findEnabled = async () => Category.find({ enabled: true }).sort({ name: 1 });

export const create = async (data) => {
  const category = new Category(data);
  await category.save();
  return category;
};

export const update = async (id, data) => Category.findByIdAndUpdate(id, data, { new: true });

export const remove = async (id) => Category.findByIdAndDelete(id);
