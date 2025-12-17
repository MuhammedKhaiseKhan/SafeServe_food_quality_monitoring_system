import { Router } from 'express';
import { createForm, getForms, getFormById } from '../controllers/forms.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN']), createForm);
router.get('/', authenticateToken, getForms); // All authenticated users can see forms? Yes
router.get('/:id', authenticateToken, getFormById);

export default router;
