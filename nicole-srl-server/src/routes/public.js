import { Router } from 'express';
import * as publicController from '../controllers/publicController.js';

const router = Router();

router.get('/products', publicController.getProducts);
router.get('/products/featured', publicController.getFeaturedProducts);
router.get('/hero-slides', publicController.getHeroSlides);

export default router;
