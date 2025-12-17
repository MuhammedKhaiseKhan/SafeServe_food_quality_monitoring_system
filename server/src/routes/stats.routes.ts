import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'HOTEL_MANAGER']), getDashboardStats);

export default router;
