'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CheckCircle2, BarChart3, Building } from 'lucide-react';

export default function HotelManagerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const statsRes = await fetch('http://localhost:4000/reports/stats', { headers });
        if (statsRes.ok) setStats(await statsRes.json());

        const reportsRes = await fetch('http://localhost:4000/reports', { headers });
        if (reportsRes.ok) {
            const allReports = await reportsRes.json();
            // Filter to only show APPROVED reports as per requirements
            const approvedReports = allReports.filter((r: any) => r.status === 'APPROVED');
            setReports(approvedReports);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!stats) return <div className="text-gray-500 p-6">Loading dashboard data...</div>;

    return (
        <div className="space-y-8">
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Hotel Governance</h2>
                    <p className="text-gray-500">High-level overview of hotel standards compliance.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Inspections</CardTitle>
                        <ClipboardList className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalReports}</div>
                        <p className="text-xs text-gray-500 mt-1">Conducted to date</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalReports > 0 ? Math.round((stats.approved / stats.totalReports) * 100) : 0}%</div>
                        <p className="text-xs text-gray-500 mt-1">Approved reports</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Average Quality Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{Math.round(stats.averageScore)}/100</div>
                        <p className="text-xs text-gray-500 mt-1">Across all departments</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-gray-100">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-500" />
                        <CardTitle>Certified Compliance Reports</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Date</TableHead>
                                <TableHead>Inspector</TableHead>
                                <TableHead>Form</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No approved data available.</TableCell></TableRow>}
                            {reports.map((report) => (
                                <TableRow key={report.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{report.inspector.name}</TableCell>
                                    <TableCell>{report.form.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.score >= 90 ? 'default' : 'secondary'} className={report.score >= 90 ? 'bg-green-600' : 'bg-gray-600'}>
                                            {report.score}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                                            Verified
                                        </Badge>
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
