import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const findAll = async () => Product.find().sort({ createdAt: -1 });

export const findById = async (id) => Product.findById(id);

export const create = async (data) => {
  const product = new Product(data);
  await product.save();
  return product;
};

export const update = async (id, data) => Product.findByIdAndUpdate(id, data, { new: true });

export const remove = async (id) => Product.findByIdAndDelete(id);

export const findPublic = async () => {
  const enabledCategories = await Category.find({ enabled: true }).distinct('slug');
  return Product.find({ category: { $in: enabledCategories } }).sort({ createdAt: -1 });
};

export const findPublicFeatured = async () => {
  const enabledCategories = await Category.find({ enabled: true }).distinct('slug');
  return Product.find({ isFeatured: true, category: { $in: enabledCategories } }).sort({ createdAt: -1 });
};
