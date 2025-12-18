import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser, changePassword, createUser } from '../controllers/users.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all routes below
router.use(requireRole(['ADMIN'])); // Only Admins can manage users

router.get('/', getAllUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.patch('/:id/password', changePassword);
router.delete('/:id', deleteUser);

export default router;
