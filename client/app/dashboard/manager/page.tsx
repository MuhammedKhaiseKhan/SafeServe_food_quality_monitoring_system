'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, AlertCircle, CheckCircle2, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManagerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const statsRes = await fetch('http://localhost:4000/reports/stats', { headers });
        if (statsRes.ok) setStats(await statsRes.json());

        const reportsRes = await fetch('http://localhost:4000/reports', { headers });
        if (reportsRes.ok) setReports(await reportsRes.json());
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!stats) return <div className="text-gray-500 p-6">Loading dashboard data...</div>;

    return (
        <div className="space-y-8">
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Kitchen Overview</h2>
                    <p className="text-gray-500">Monitor food safety reports and scores.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
                        <ClipboardList className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalReports}</div>
                        <p className="text-xs text-gray-500 mt-1">All time submissions</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-l-4 border-l-amber-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                        <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                        <p className="text-xs text-gray-500 mt-1">Compliant reports</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Avg Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{Math.round(stats.averageScore)}%</div>
                        <p className="text-xs text-gray-500 mt-1">Performance metric</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-gray-100">
                <CardHeader>
                    <CardTitle>Recent Inspection Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="w-[100px]">Date</TableHead>
                                <TableHead>Inspector</TableHead>
                                <TableHead>Form</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{report.inspector.name}</TableCell>
                                    <TableCell>{report.form.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.score >= 80 ? 'default' : 'destructive'} className={report.score >= 80 ? 'bg-green-600' : 'bg-red-600'}>
                                            {report.score}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${report.status === 'APPROVED' ? 'border-green-500 text-green-600' :
                                                report.status === 'REJECTED' ? 'border-red-500 text-red-600' :
                                                    'border-amber-500 text-amber-600'}
                                        `}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
