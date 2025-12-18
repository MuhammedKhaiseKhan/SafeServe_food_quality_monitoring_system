import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createForm = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, structure } = req.body;
        const form = await prisma.inspectionForm.create({
            data: { title, structure: JSON.stringify(structure ?? {}) },
        });
        res.status(201).json({ ...form, structure: JSON.parse(form.structure) });
    } catch (error) {
        res.status(500).json({ message: 'Error creating form' });
    }
};

export const getForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const forms = await prisma.inspectionForm.findMany();
        const parsedForms = forms.map(f => ({ ...f, structure: JSON.parse(f.structure) }));
        res.json(parsedForms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forms' });
    }
};

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const form = await prisma.inspectionForm.findUnique({ where: { id: Number(id) } });
        if (!form) {
            res.status(404).json({ message: 'Form not found' });
            return;
        }
        res.json({ ...form, structure: JSON.parse(form.structure) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching form' });
    }
};

export const updateForm = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, structure } = req.body;
        const form = await prisma.inspectionForm.update({
            where: { id: Number(id) },
            data: { title, structure: JSON.stringify(structure ?? {}) },
        });
        res.json({ ...form, structure: JSON.parse(form.structure) });
    } catch (error) {
        res.status(500).json({ message: 'Error updating form' });
    }
};

export const deleteForm = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.inspectionForm.delete({ where: { id: Number(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting form' });
    }
};
