'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { BlurText } from '@/components/reactbits/BlurText';
import { motion, AnimatePresence } from 'framer-motion';


const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

    const roles = [
        { name: 'Inspector', emoji: '🔦', color: 'text-green-600' },
        { name: 'Kitchen Manager', emoji: '👨‍🍳', color: 'text-blue-600' },
        { name: 'Hotel Manager', emoji: '🏨', color: 'text-purple-600' },
        { name: 'Admin', emoji: '🛡️', color: 'text-red-500' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (values: LoginValues) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include', // Important for setting the cookie
            });
            const data = await res.json();

            if (res.ok) {
                // Token is now in a cookie, AND returned in body for fallback
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
                    <BlurText
                        text="Excellence in Every Detail."
                        className="text-4xl font-bold mb-2 text-left"
                        delay={0.2}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        Ensure the highest quality standards for your guests.
                    </motion.p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="relative flex items-center justify-center bg-gray-50 p-6 overflow-hidden">
                <div className="relative z-10 w-full max-w-md">
                    <Card className="w-full shadow-xl animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4 bg-white border-0">
                        <CardHeader className="space-y-1 text-center">
                            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm relative overflow-hidden ring-1 ring-gray-100">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={roles[currentRoleIndex].name}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute select-none ${roles[currentRoleIndex].color}`}
                                    >
                                        {roles[currentRoleIndex].emoji}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <div className="h-6 relative overflow-hidden mb-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={roles[currentRoleIndex].name}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute w-full text-center text-sm font-semibold ${roles[currentRoleIndex].color}`}
                                    >
                                        {roles[currentRoleIndex].name}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Sign in to SafeServe</CardTitle>
                            <CardDescription className="text-gray-500">Enter your credentials to access the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className={errors.email ? 'text-red-500' : 'text-gray-700'}>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@hotel.com"
                                        {...register('email')}
                                        className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-green-100'}`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <AlertCircle size={12} /> {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className={errors.password ? 'text-red-500' : 'text-gray-700'}>Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            {...register('password')}
                                            className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-green-100'}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <AlertCircle size={12} /> {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full h-11 bg-green-700 hover:bg-green-800 text-lg shadow-md hover:shadow-lg transition-all duration-300" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : 'Sign In'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
