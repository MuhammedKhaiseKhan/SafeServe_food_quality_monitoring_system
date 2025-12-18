'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, FileText, CheckCircle, BookOpen, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        pendingReports: 0,
        guidelines: 0,
        users: 0,
        forms: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:4000/stats', {
                    credentials: 'include', // Send the cookie
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        pendingReports: data.pendingReports,
                        guidelines: data.guidelines,
                        users: data.users,
                        forms: data.forms
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h2>
                    <p className="text-gray-500">Manage your organization's food safety standards.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Pending Approvals</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{stats.pendingReports}</div>
                        <p className="text-xs text-blue-600/80 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Active Guidelines</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">{stats.guidelines}</div>
                        <p className="text-xs text-green-600/80 mt-1">Across all categories</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.forms}</div>
                        <p className="text-xs text-muted-foreground mt-1">Inspection templates</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Grid */}
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/admin/approvals" className='group'>
                    <Card className="h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500 group-hover:scale-[1.02]">
                        <CardHeader>
                            <div className="mb-2 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <CheckCircle size={20} />
                            </div>
                            <CardTitle className="group-hover:text-blue-700 transition-colors">Approvals Queue</CardTitle>
                            <CardDescription>Review and certify pending inspection reports.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/guidelines" className='group'>
                    <Card className="h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500 group-hover:scale-[1.02]">
                        <CardHeader>
                            <div className="mb-2 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <CardTitle className="group-hover:text-green-700 transition-colors">Manage Guidelines</CardTitle>
                            <CardDescription>Update food safety standards and protocols.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/users" className='group'>
                    <Card className="h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500 group-hover:scale-[1.02]">
                        <CardHeader>
                            <div className="mb-2 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Users size={20} />
                            </div>
                            <CardTitle className="group-hover:text-purple-700 transition-colors">Manage Users</CardTitle>
                            <CardDescription>Add or remove system inspectors and managers.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/forms" className='group'>
                    <Card className="h-full hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500 group-hover:scale-[1.02]">
                        <CardHeader>
                            <div className="mb-2 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <FileText size={20} />
                            </div>
                            <CardTitle className="group-hover:text-orange-700 transition-colors">Manage Forms</CardTitle>
                            <CardDescription>Edit inspection checklists and criteria.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
