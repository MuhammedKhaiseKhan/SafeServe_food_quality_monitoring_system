import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                select: { id: true, name: true, email: true, role: true, createdAt: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count()
        ]);

        res.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'INSPECTOR'
            },
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { name, email, role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { name, email, role }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { password } = req.body;

        if (!password || password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 chars' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password' });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};
