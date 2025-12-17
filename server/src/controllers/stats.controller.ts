import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [
            usersCount,
            formsCount,
            guidelinesCount,
            pendingReportsCount
        ] = await Promise.all([
            prisma.user.count(),
            prisma.form.count(),
            prisma.guideline.count(),
            prisma.report.count({ where: { status: 'PENDING' } })
        ]);

        res.json({
            users: usersCount,
            forms: formsCount,
            guidelines: guidelinesCount,
            pendingReports: pendingReportsCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
