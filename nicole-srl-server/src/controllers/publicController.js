import * as productService from '../services/productService.js';
import * as heroSlideService from '../services/heroSlideService.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productService.findPublic();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.findPublicFeatured();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await heroSlideService.findPublic();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
