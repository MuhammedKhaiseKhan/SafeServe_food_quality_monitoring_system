import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createGuideline = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, roleTarget, category, severity } = req.body;
        const guideline = await prisma.guideline.create({
            data: { title, content, roleTarget, category, severity }
        });
        res.status(201).json(guideline);
    } catch (error) {
        res.status(500).json({ message: 'Error creating guideline' });
    }
};

export const getGuidelines = async (req: Request, res: Response): Promise<void> => {
    try {
        const guidelines = await prisma.guideline.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(guidelines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guidelines' });
    }
};

export const updateGuideline = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, roleTarget, category, severity } = req.body;
        const guideline = await prisma.guideline.update({
            where: { id },
            data: { title, content, roleTarget, category, severity }
        });
        res.json(guideline);
    } catch (error) {
        res.status(500).json({ message: 'Error updating guideline' });
    }
};

export const deleteGuideline = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        await prisma.guideline.delete({ where: { id } });
        res.json({ message: 'Guideline deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting guideline' });
    }
};
