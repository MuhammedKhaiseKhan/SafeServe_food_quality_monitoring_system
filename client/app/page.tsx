'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, ClipboardList, Lock, LayoutDashboard, ChevronRight, UserCheck, FileText, ArrowRight, Activity, Globe } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const roles = [
    { name: 'Inspector', emoji: '🔦', color: 'text-green-400' },
    { name: 'Kitchen Manager', emoji: '🍳', color: 'text-blue-400' },
    { name: 'Hotel Manager', emoji: '🏨', color: 'text-purple-400' },
    { name: 'Admin', emoji: '⚙️', color: 'text-red-400' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-teal-100">
      {/* Navigation */}
      <nav className="fixed w-full items-center justify-between flex p-6 px-8 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">

        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SafeServe Logo" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-gray-900">SafeServe</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium text-gray-600 hover:text-teal-700">Log In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Now available for enterprise hotels
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              Ensure Food Safety & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                Quality with Confidence.
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            A role-based food quality monitoring system built specifically for modern hotel workflows. Digitize your inspections and standardise compliance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-teal-700 hover:bg-teal-800 text-white h-12 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
                View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-8 rounded-full text-lg"
            >
              Explore Features
            </Button>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-teal-600" /> Free 14-day trial</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-teal-600" /> No credit card required</span>
          </div>
        </div>
        <div className="flex-1 relative animate-in slide-in-from-right-8 duration-1000 fade-in delay-200">
          <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white">
            <div className="aspect-video relative bg-gray-100 overflow-hidden">
              <img
                src="/dashboard-mockup.png"
                alt="SafeServe Dashboard"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Abstract background elements */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-50 z-0"></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why traditional monitoring fails</h2>
            <p className="text-gray-600">Manual processes leave room for error and lack the visibility needed for enterprise compliance.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: ClipboardList, title: "Manual Inspections", desc: "Paper-based forms get lost or damaged." },
              { icon: Activity, title: "No Visibility", desc: "Managers can't track real-time compliance." },
              { icon: UserCheck, title: "Poor Accountability", desc: "Hard to verify who checked what and when." },
              { icon: Globe, title: "Scattered Guidelines", desc: "Standards not centralized or accessible." }
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-teal-600 font-semibold tracking-wide uppercase text-sm">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">Complete Quality Control</h2>
          <p className="text-gray-600 max-w-2xl text-lg">Everything you need to maintain the highest standards of food safety across your organization.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: CheckCircle, title: "Digital Inspections", desc: "Mobile-friendly forms for quick and accurate daily checks." },
            { icon: FileText, title: "Centralized Guidelines", desc: "Update standards once and push to all locations instantly." },
            { icon: Lock, title: "Role-Based Access", desc: "Granular permissions for Inspectors, Managers, and Admins." },
            { icon: ShieldCheck, title: "Approval Workflows", desc: "Ensure every report is reviewed and verified by management." },
            { icon: LayoutDashboard, title: "Compliance Dashboard", desc: "Real-time birds-eye view of your safety status." },
            { icon: Activity, title: "Audit Trail", desc: "Complete history of all actions and changes for accountability." },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
              <div className="shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role-Based Access */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Your Entire Team</h2>
            <p className="text-gray-400">Streamlined interfaces tailored for every stakeholder.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { role: "Inspector", desc: "Submit daily reports & checklists on the go.", color: "bg-blue-500" },
              { role: "Kitchen Manager", desc: "Review guidelines and monitor team performance.", color: "bg-green-500" },
              { role: "Hotel Manager", desc: "Oversee compliance across multiple departments.", color: "bg-purple-500" },
              { role: "Admin", desc: "Full system control, user management, and configuration.", color: "bg-orange-500" },
            ].map((card, i) => (
              <div key={i} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className={`w-3 h-3 rounded-full ${card.color} mb-6`}></div>
                <h3 className="text-xl font-bold mb-3">{card.role}</h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">How it Works</h2>
        <div className="relative">
          {/* Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>

          {[
            { step: "01", title: "Define Standards", desc: "Admins set up inspection forms and safety guidelines." },
            { step: "02", title: "Inspect", desc: "Inspectors complete digital checklists on the floor." },
            { step: "03", title: "Submit Report", desc: "Findings are logged instantly with photos and notes." },
            { step: "04", title: "Review & Approve", desc: "Managers verify reports and flag issues for correction." },
            { step: "05", title: "Monitor", desc: "Track long-term trends and maintain 100% compliance." }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center gap-8 mb-12 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
              <div className="z-10 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
                {item.step}
              </div>
              <div className="flex-1"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-blue-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Production-Ready RBAC",
              "Secure & Scalable",
              "Audit-Friendly Design",
              "Real Hotel Workflows"
            ].map((text, i) => (
              <div key={i} className="font-semibold text-blue-900 flex items-center justify-center gap-2">
                <CheckCircle className="text-blue-600 h-5 w-5" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to elevate your <br />quality standards?</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join the new standard in hospitality food safety management.</p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all font-semibold">
              Go to Dashboard
            </Button>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="SafeServe Logo" width={24} height={24} className="w-6 h-6 object-contain" />
            <span className="font-bold text-gray-900">SafeServe</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SafeServe Systems. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
}
