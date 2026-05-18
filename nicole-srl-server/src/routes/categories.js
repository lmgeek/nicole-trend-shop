import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/enabled', categoryController.getEnabled);
router.get('/:id', authenticateToken, categoryController.getById);
router.post('/', authenticateToken, categoryController.create);
router.put('/:id', authenticateToken, categoryController.update);
router.delete('/:id', authenticateToken, categoryController.remove);

export default router;
