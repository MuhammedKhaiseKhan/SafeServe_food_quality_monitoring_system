import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser, changePassword, createUser } from '../controllers/users.controller';

const router = Router();

// In a real app, you'd add middleware here like: router.use(authenticate, requireAdmin)
router.get('/', getAllUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.patch('/:id/password', changePassword);
router.delete('/:id', deleteUser);

export default router;
