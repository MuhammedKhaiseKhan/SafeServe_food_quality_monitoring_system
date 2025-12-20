'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, FileText, CheckCircle, XCircle, Eye, Sparkles } from 'lucide-react';

export default function AdminApprovalsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const fetchReports = async (pageNum = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/reports?page=${pageNum}&limit=10`, {
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReports(data.reports);
                setTotalPages(data.totalPages);
                setPage(data.page);
            }
        } catch (error) {
            toast.error("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/reports/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
            credentials: 'include'
        });
        if (res.ok) {
            toast.success(`Report ${status}`);
            setIsSheetOpen(false);
            fetchReports();
        }
    };

    const viewReport = (report: any) => {
        setSelectedReport(report);
        setIsSheetOpen(true);
    };

    const TableSkeleton = () => (
        <>
            {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Report Approvals</h2>
            <Card>
                <CardHeader><CardTitle>Pending Inspection Reports</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto max-w-[85vw] md:max-w-full">
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
                                {loading ? (
                                    <TableSkeleton />
                                ) : reports.filter(r => r.status === 'PENDING').length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No pending reports</TableCell></TableRow>
                                ) : (
                                    reports.filter(r => r.status === 'PENDING').map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{report.inspector.name}</TableCell>
                                            <TableCell>{report.form.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={report.score >= 80 ? 'default' : 'destructive'} className={report.score >= 80 ? 'bg-green-600' : 'bg-red-600'}>
                                                    {report.score}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-amber-500 text-amber-600">{report.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="outline" className="gap-2" onClick={() => viewReport(report)}>
                                                    <Eye size={14} /> Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto max-w-[85vw] md:max-w-full">
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
                                {loading ? (
                                    <TableSkeleton />
                                ) : (
                                    reports.filter(r => r.status !== 'PENDING').map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
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
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {/* Pagination (omitted for brevity if unchanged, but keeping logical structure) */}
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl p-0 gap-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-2">
                            <FileText className="text-gray-500" /> Report Details
                        </SheetTitle>
                        <SheetDescription>
                            Review the inspection report analysis and take action.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedReport && (
                            <div className="space-y-6">
                                {/* AI Summary Section */}
                                {selectedReport.aiSummary && (
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5">
                                            <Bot size={100} />
                                        </div>
                                        <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                                            <Sparkles size={16} className="text-indigo-600" /> AI Executive Summary
                                        </h4>
                                        <p className="text-sm text-indigo-800 leading-relaxed">
                                            {selectedReport.aiSummary}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Inspector</p>
                                        <p className="font-medium">{selectedReport.inspector.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Submission Date</p>
                                        <p className="font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Form Type</p>
                                        <p className="font-medium">{selectedReport.form.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Overall Score</p>
                                        <Badge variant={selectedReport.score >= 80 ? 'default' : 'destructive'} className={selectedReport.score >= 80 ? 'bg-green-600' : 'bg-red-600'}>
                                            {selectedReport.score}/100
                                        </Badge>
                                    </div>
                                </div>

                                {/* Action Buttons for Pending Reports */}
                                {selectedReport.status === 'PENDING' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(selectedReport.id, 'APPROVED')}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Report
                                        </Button>
                                        <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(selectedReport.id, 'REJECTED')}>
                                            <XCircle className="mr-2 h-4 w-4" /> Reject Report
                                        </Button>
                                    </div>
                                )}

                                {/* Raw Data Preview (Optional, for full context) */}
                                <div className="border rounded-lg p-4 bg-gray-50 text-xs">
                                    <h5 className="font-semibold mb-2 text-gray-700">Detailed Responses</h5>
                                    <pre className="whitespace-pre-wrap font-mono text-gray-600 overflow-x-auto">
                                        {JSON.stringify(selectedReport.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div >
    );
}
