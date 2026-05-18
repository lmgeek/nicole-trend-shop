import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as productController from '../controllers/productController.js';

const router = Router();

router.get('/', authenticateToken, productController.getAll);
router.get('/:id', authenticateToken, productController.getById);
router.post('/', authenticateToken, productController.create);
router.put('/:id', authenticateToken, productController.update);
router.delete('/:id', authenticateToken, productController.remove);

export default router;
