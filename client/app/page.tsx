'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const roles = [
    { name: 'Inspector', emoji: '🔦', color: 'text-green-400' },
    { name: 'Kitchen Manager', emoji: '👨‍🍳', color: 'text-orange-400' },
    { name: 'Hotel Management', emoji: '🏨', color: 'text-purple-400' },
    { name: 'System Admin', emoji: '🛡️', color: 'text-blue-400' },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentRole = roles[index];

  return (
    <div className="min-h-screen flex flex-col relative bg-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2874&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full space-y-12 text-center">

          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-7xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
              Safe<span className="text-green-500">Serve</span>
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
              The Gold Standard in Hospitality Safety.
            </p>
          </div>

          {/* Dynamic Role Card */}
          <div className="flex items-center justify-center">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white p-8 w-full max-w-sm mx-auto shadow-2xl skew-y-0 hover:scale-105 transition-all duration-500">
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2 h-32 flex flex-col items-center justify-center">
                  <div key={currentRole.name + 'emoji'} className="text-6xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                    {currentRole.emoji}
                  </div>
                  <div key={currentRole.name + 'text'} className={`text-2xl font-bold tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700 ${currentRole.color}`}>
                    {currentRole.name}
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-2 animate-in fade-in duration-1000 delay-100">Portal Access</p>
                </div>

                <Link href="/login" className="block w-full">
                  <Button className="w-full h-12 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Enter System
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <footer className="relative z-10 mt-auto py-8 text-center text-gray-500 text-xs tracking-[0.2em] uppercase font-light">
        &copy; 2025 SafeServe Hospitality Solutions
      </footer>
    </div>
  );
}
