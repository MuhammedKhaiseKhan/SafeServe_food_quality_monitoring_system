'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    ClipboardList,
    FileText,
    Users,
    FileEdit,
    CheckCircle,
    BookOpen,
    Menu,
    LogOut,
    Building
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) return <div className="flex items-center justify-center min-h-screen text-green-600">Loading SafeServe...</div>;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const role = user.role.toLowerCase();

    const NavContent = () => (
        <nav className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Menu
            </div>

            {/* Inspector Links */}
            {role === 'inspector' && (
                <>
                    <NavLink href="/dashboard/inspector" icon={<FileEdit size={18} />} label="New Inspection" active={pathname === '/dashboard/inspector'} />
                    <NavLink href="/dashboard/inspector/history" icon={<ClipboardList size={18} />} label="My Reports" active={pathname?.includes('/history')} />
                </>
            )}

            {/* Manager / Admin / Hotel Mgr Links */}
            {(role === 'manager' || role === 'admin' || role === 'hotel_manager') && (
                <>
                    <NavLink
                        href={`/dashboard/${role === 'hotel_manager' ? 'hotel_manager' : role}`}
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard Overview"
                        active={pathname === `/dashboard/${role === 'hotel_manager' ? 'hotel_manager' : role}`}
                    />
                    {role !== 'hotel_manager' && (
                        <NavLink href="/dashboard/manager/guidelines" icon={<BookOpen size={18} />} label="Guidelines" active={pathname?.includes('/guidelines') && role === 'manager'} />
                    )}
                </>
            )}

            {/* Admin Exclusive */}
            {role === 'admin' && (
                <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">
                        Administration
                    </div>
                    <NavLink href="/dashboard/admin/approvals" icon={<CheckCircle size={18} />} label="Approvals Queue" active={pathname?.includes('/approvals')} />
                    <NavLink href="/dashboard/admin/guidelines" icon={<BookOpen size={18} />} label="Manage Guidelines" active={pathname?.includes('/guidelines')} />
                    <NavLink href="/dashboard/admin/users" icon={<Users size={18} />} label="Manage Users" active={pathname?.includes('/users')} />
                    <NavLink href="/dashboard/admin/forms" icon={<FileText size={18} />} label="Manage Forms" active={pathname?.includes('/forms')} />
                </>
            )}
        </nav>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">S</div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">SafeServe</span>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <NavContent />
                </div>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut size={16} className="mr-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Main Content */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <header className="md:hidden bg-white border-b h-16 flex items-center justify-between px-4 sticky top-0 z-10 transition-shadow shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <span className="text-lg font-bold text-gray-900">SafeServe</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu size={24} /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                                <span className="text-xl font-bold text-gray-900">SafeServe</span>
                            </div>
                            <div className="p-4">
                                <NavContent />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                                <Button variant="outline" className="w-full justify-start text-red-600" onClick={handleLogout}>
                                    <LogOut size={16} className="mr-2" /> Logout
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-green-50 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <span className={active ? 'text-green-600' : 'text-gray-400'}>{icon}</span>
            {label}
        </Link>
    );
}
