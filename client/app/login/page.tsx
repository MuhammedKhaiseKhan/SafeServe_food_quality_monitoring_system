'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (values: LoginValues) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success(`Welcome back, ${data.user.name}`);

                // Redirect based on role
                switch (data.user.role) {
                    case 'ADMIN': router.push('/dashboard/admin'); break;
                    case 'INSPECTOR': router.push('/dashboard/inspector'); break;
                    case 'MANAGER': router.push('/dashboard/manager'); break;
                    case 'HOTEL_MANAGER': router.push('/dashboard/hotel_manager'); break;
                    default: router.push('/dashboard');
                }
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left: Image Side */}
            <div className="hidden md:block bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2662&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-10 left-10 text-white p-6">
                    <h2 className="text-4xl font-bold mb-2">Excellence in Every Detail.</h2>
                    <p className="opacity-90">Ensure the highest quality standards for your guests.</p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center bg-gray-50 p-6">
                <Card className="w-full max-w-md shadow-2xl border-0">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">S</div>
                        <CardTitle className="text-2xl font-bold">Sign in to SafeServe</CardTitle>
                        <CardDescription>Enter your credentials to access the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@hotel.com"
                                    {...register('email')}
                                    className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} /> {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className={`h-11 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} /> {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full h-11 bg-green-700 hover:bg-green-800 text-lg" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm text-gray-500 mt-4">
                                Demo? Use <span className="font-mono bg-gray-100 px-1">admin@hotel.com</span> / <span className="font-mono bg-gray-100 px-1">admin123</span>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
import Link from 'next/link';
