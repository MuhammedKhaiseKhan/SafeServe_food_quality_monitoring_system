import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { evaluateReport } from '../services/ai.service';

export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { formId, data } = req.body;
        const inspectorId = req.user!.userId;

        // AI Evaluation
        const { summary, score } = evaluateReport(data);

        const report = await prisma.inspectionReport.create({
            data: {
                formId,
                inspectorId,
                data: JSON.stringify(data ?? {}),
                aiSummary: summary,
                score,
                status: 'PENDING',
            },
        });

        res.status(201).json({ ...report, data: JSON.parse(report.data) });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting report' });
    }
};

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { role, userId } = req.user!;
        let whereClause = {};

        if (role === 'INSPECTOR') {
            whereClause = { inspectorId: userId };
        }
        // Managers/Admins see all

        const reports = await prisma.inspectionReport.findMany({
            where: whereClause,
            include: {
                inspector: { select: { name: true, email: true } },
                form: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const parsedReports = reports.map(r => ({ ...r, data: JSON.parse(r.data) }));
        res.json(parsedReports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
};

export const updateReportStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED or REJECTED

        const report = await prisma.inspectionReport.update({
            where: { id: Number(id) },
            data: { status },
        });

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating report' });
    }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalReports = await prisma.inspectionReport.count();
        const pending = await prisma.inspectionReport.count({ where: { status: 'PENDING' } });
        const approved = await prisma.inspectionReport.count({ where: { status: 'APPROVED' } });
        const avgScore = await prisma.inspectionReport.aggregate({
            _avg: { score: true }
        });

        res.json({
            totalReports,
            pending,
            approved,
            averageScore: avgScore._avg.score || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
}
