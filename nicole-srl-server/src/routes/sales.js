import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as saleController from '../controllers/saleController.js';

const router = Router();

router.get('/', authenticateToken, saleController.getAll);
router.post('/', authenticateToken, saleController.create);
router.put('/:id', authenticateToken, saleController.update);
router.delete('/:id', authenticateToken, saleController.remove);

export default router;
