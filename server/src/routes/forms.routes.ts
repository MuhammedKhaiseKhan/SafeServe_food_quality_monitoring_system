import { Router } from 'express';
import { createForm, getForms, getFormById, updateForm, deleteForm } from '../controllers/forms.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN']), createForm);
router.get('/', authenticateToken, getForms); // All authenticated users can see forms? Yes
router.get('/:id', authenticateToken, getFormById);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateForm);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteForm);

export default router;
