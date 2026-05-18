import { HeroSlide } from '../models/HeroSlide.js';

export const findAll = async () => HeroSlide.find().sort({ order: 1 }).populate('product');

export const findById = async (id) => HeroSlide.findById(id).populate('product');

export const findPublic = async () => HeroSlide.find({ enabled: true }).sort({ order: 1 }).populate('product');

export const create = async (data) => {
  const { product, ...rest } = data;
  const slideData = { ...rest };
  if (product && product !== '') slideData.product = product;
  const slide = new HeroSlide(slideData);
  await slide.save();
  return slide;
};

export const update = async (id, data) => {
  const { product, ...rest } = data;
  const slideData = { ...rest };
  if (product && product !== '') slideData.product = product;
  else slideData.product = undefined;
  return HeroSlide.findByIdAndUpdate(id, slideData, { new: true });
};

export const remove = async (id) => HeroSlide.findByIdAndDelete(id);
