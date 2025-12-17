import { Router } from 'express';
import { createGuideline, getGuidelines, updateGuideline, deleteGuideline } from '../controllers/guidelines.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN']), createGuideline);
router.get('/', authenticateToken, getGuidelines);
router.patch('/:id', authenticateToken, requireRole(['ADMIN']), updateGuideline);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteGuideline);

export default router;
