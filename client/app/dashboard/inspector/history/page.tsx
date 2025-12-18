'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollText, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InspectorHistoryPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReports = async (pageNum = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/reports?page=${pageNum}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setReports(data.reports);
                setTotalPages(data.totalPages);
                setPage(data.page);
            }
        } catch (error) {
            console.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-green-600">Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
            default: return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">My Inspections</h2>
                <p className="text-gray-500">History of all audits you have submitted.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScrollText className="h-5 w-5 text-gray-400" />
                        Report History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading your history...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Checklist</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>AI Summary</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                                No inspections found. Start a new one!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {reports.map((report) => (
                                        <TableRow key={report.id} className="hover:bg-slate-50 transition-colors duration-200">
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{report.form.title}</TableCell>
                                            <TableCell>
                                                <span className={`font-bold ${getScoreColor(report.score)}`}>
                                                    {report.score}/100
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-gray-500 text-xs">
                                                {report.aiSummary}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(report.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 pb-6">
                        <div className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchReports(page - 1)}
                                disabled={page <= 1 || loading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchReports(page + 1)}
                                disabled={page >= totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
