'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminApprovalsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchReports = async (pageNum = 1) => {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/reports?page=${pageNum}&limit=10`, {
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setReports(data.reports);
            setTotalPages(data.totalPages);
            setPage(data.page);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        const res = await fetch(`http://localhost:4000/reports/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            credentials: 'include'
        });
        if (res.ok) {
            toast.success(`Report ${status}`);
            fetchReports();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Report Approvals</h2>
            <Card>
                <CardHeader><CardTitle>Pending Inspection Reports</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Inspector</TableHead>
                                    <TableHead>Form</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.filter(r => r.status === 'PENDING').length === 0 && <TableRow><TableCell colSpan={6} className="text-center">No pending reports</TableCell></TableRow>}
                                {reports.filter(r => r.status === 'PENDING').map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{report.inspector.name}</TableCell>
                                        <TableCell>{report.form.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={report.score >= 80 ? 'default' : 'destructive'}>{report.score}</Badge>
                                        </TableCell>
                                        <TableCell>{report.status}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleStatusUpdate(report.id, 'APPROVED')}>Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(report.id, 'REJECTED')}>Reject</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Inspector</TableHead>
                                    <TableHead>Form</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.filter(r => r.status !== 'PENDING').map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{report.inspector.name}</TableCell>
                                        <TableCell>{report.form.title}</TableCell>
                                        <TableCell><Badge variant={report.score >= 80 ? 'default' : 'destructive'}>{report.score}</Badge></TableCell>
                                        <TableCell>{report.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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
        </div >
    );
}
