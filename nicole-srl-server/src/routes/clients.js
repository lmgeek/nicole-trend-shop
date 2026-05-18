import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as clientController from '../controllers/clientController.js';

const router = Router();

router.get('/', authenticateToken, clientController.getAll);
router.post('/', authenticateToken, clientController.create);
router.put('/:id', authenticateToken, clientController.update);
router.delete('/:id', authenticateToken, clientController.remove);

export default router;
