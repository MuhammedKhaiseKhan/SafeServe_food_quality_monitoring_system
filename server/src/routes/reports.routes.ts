import { Router } from 'express';
import { submitReport, getReports, updateReportStatus, getStats } from '../controllers/reports.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, requireRole(['INSPECTOR', 'ADMIN']), submitReport);
router.get('/', authenticateToken, getReports);
router.patch('/:id/status', authenticateToken, requireRole(['ADMIN']), updateReportStatus);
router.get('/stats', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'HOTEL_MANAGER']), getStats);

export default router;
