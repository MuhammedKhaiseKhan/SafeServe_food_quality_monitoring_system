'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ShieldAlert, AlertTriangle, Info, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GuidelinesPage() {
    const [guidelines, setGuidelines] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        const fetchGuidelines = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/guidelines`, {
                    credentials: 'include'
                });
                if (res.ok) setGuidelines(await res.json());
            } catch (error) {
                console.error("Failed to fetch guidelines");
            }
        };
        fetchGuidelines();
    }, []);

    const categories = ['All', ...Array.from(new Set(guidelines.map(g => g.category || 'General')))];

    const filteredGuidelines = guidelines.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || (g.category || 'General') === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'Critical': return <Badge variant="destructive" className="bg-red-600 flex gap-1"><ShieldAlert size={12} /> Critical</Badge>;
            case 'Major': return <Badge className="bg-amber-500 hover:bg-amber-600 flex gap-1"><AlertTriangle size={12} /> Major</Badge>;
            default: return <Badge variant="secondary" className="flex gap-1"><Info size={12} /> Minor</Badge>;
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Food Quality Standards</h2>
                    <p className="text-gray-500">Reference guide for all operational protocols.</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search guidelines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-11"
                    />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[200px] h-11">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Filter size={16} />
                            <SelectValue placeholder="Category" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat as string} value={cat as string}>{cat as string}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Guidelines Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGuidelines.map(g => (
                    <Card key={g.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full border-gray-200 border-t-4 border-t-transparent hover:border-t-green-500">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                {getSeverityBadge(g.severity)}
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{g.category}</span>
                            </div>
                            <CardTitle className="leading-snug text-xl text-gray-800 group-hover:text-green-700 transition-colors">
                                {g.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                                <p className="whitespace-pre-wrap font-light">{g.content}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredGuidelines.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <BookOpen size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-500">No guidelines found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
