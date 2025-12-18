'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose
} from "@/components/ui/sheet";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { MoreHorizontal, UserCog, Shield, Trash2, KeyRound, Search, BadgeCheck, Mail, UserPlus, Lock } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<'edit' | 'create'>('edit');
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form States
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });
    const [passwordData, setPasswordData] = useState({ password: '' });
    const [createData, setCreateData] = useState({ name: '', email: '', password: '', role: 'INSPECTOR' });

    const fetchUsers = async (pageNum = 1) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users?page=${pageNum}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
                setPage(data.page);
            }
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const openEditSheet = (user: any) => {
        setSheetMode('edit');
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setPasswordData({ password: '' });
        setIsSheetOpen(true);
    };

    const openCreateSheet = () => {
        setSheetMode('create');
        setCreateData({ name: '', email: '', password: '', role: 'INSPECTOR' });
        setIsSheetOpen(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(createData),
        });

        if (res.ok) {
            toast.success('User created successfully');
            setIsSheetOpen(false);
            fetchUsers();
        } else {
            const err = await res.json();
            toast.error(err.message || 'Failed to create user');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/${selectedUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        if (res.ok) {
            toast.success('User profile updated');
            fetchUsers();
        } else {
            toast.error('Failed to update profile');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/${selectedUser.id}/password`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(passwordData),
            credentials: 'include'
        });

        if (res.ok) {
            toast.success('Password updated successfully');
            setPasswordData({ password: '' });
        } else {
            const err = await res.json();
            toast.error(err.message || 'Failed to update password');
        }
    };

    const handleDeleteUser = (id: number) => {
        toast("Are you sure you want to delete this user?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/users/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                        credentials: 'include'
                    });

                    if (res.ok) {
                        toast.success('User deleted');
                        fetchUsers();
                    } else {
                        toast.error('Failed to delete user');
                    }
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-gray-500">View and manage system access and permissions.</p>
                </div>
                <Button onClick={openCreateSheet} className="gap-2 bg-green-600 hover:bg-green-700">
                    <UserPlus size={18} /> Add New User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Registered Users</CardTitle>
                        <div className="relative w-64 hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Search users..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-8">Loading users...</TableCell></TableRow>
                                ) : users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                        user.role === 'HOTEL_MANAGER' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEditSheet(user)}>
                                                        <UserCog className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    {currentUser && currentUser.id !== user.id && (
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteUser(user.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUsers(page - 1)}
                                disabled={page <= 1 || loading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchUsers(page + 1)}
                                disabled={page >= totalPages || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md overflow-y-auto p-6">
                    <SheetHeader>
                        <SheetTitle>{sheetMode === 'create' ? 'Add New User' : 'Edit User'}</SheetTitle>
                        <SheetDescription>
                            {sheetMode === 'create' ? 'Create a new account for system access.' : 'Make changes to user profile or security settings.'}
                        </SheetDescription>
                    </SheetHeader>

                    {sheetMode === 'create' ? (
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input required value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" required value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Password (min 6 chars)</Label>
                                <Input type="password" required minLength={6} value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={createData.role} onValueChange={(val) => setCreateData({ ...createData, role: val })}>
                                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INSPECTOR">Inspector</SelectItem>
                                        <SelectItem value="MANAGER">Kitchen Manager</SelectItem>
                                        <SelectItem value="HOTEL_MANAGER">Hotel Manager</SelectItem>
                                        <SelectItem value="ADMIN">System Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Create Account</Button>
                        </form>
                    ) : selectedUser && (
                        <Tabs defaultValue="profile" className="mt-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-4 pt-4">
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <div className="relative">
                                            <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role Assignment</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(val) => setFormData({ ...formData, role: val })}
                                            disabled={selectedUser.role === 'ADMIN'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INSPECTOR">Inspector</SelectItem>
                                                <SelectItem value="MANAGER">Kitchen Manager</SelectItem>
                                                <SelectItem value="HOTEL_MANAGER">Hotel Manager</SelectItem>
                                                <SelectItem value="ADMIN">System Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {selectedUser.role === 'ADMIN' && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Lock size={10} /> Admin roles cannot be changed.
                                            </p>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Profile Changes</Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-4 pt-4">
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
                                        <Shield className="h-4 w-4 inline mr-2" />
                                        You are administratively resetting this user's password.
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                placeholder="Enter new password (min 6 chars)"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                                className="pl-9"
                                                minLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" variant="destructive" className="w-full">
                                        Reset Password
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
