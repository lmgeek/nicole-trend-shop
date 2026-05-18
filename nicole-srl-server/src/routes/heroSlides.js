import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as heroSlideController from '../controllers/heroSlideController.js';

const router = Router();

router.get('/', authenticateToken, heroSlideController.getAll);
router.get('/:id', authenticateToken, heroSlideController.getById);
router.post('/', authenticateToken, heroSlideController.create);
router.put('/:id', authenticateToken, heroSlideController.update);
router.delete('/:id', authenticateToken, heroSlideController.remove);

export default router;
