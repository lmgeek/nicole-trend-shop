import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAll } from '../controllers/userController.js';

const router = Router();

router.get('/', authenticateToken, getAll);

export default router;
