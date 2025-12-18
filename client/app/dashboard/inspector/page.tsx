'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEdit, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function InspectorDashboard() {
    const [forms, setForms] = useState<any[]>([]);
    const [selectedForm, setSelectedForm] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [reportSummary, setReportSummary] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null); // New state for stats

    useEffect(() => {
        const fetchForms = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/forms`, {
                credentials: 'include'
            });
            if (res.ok) setForms(await res.json());
        };
        fetchForms();
    }, []);

    // New useEffect for fetching stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/stats`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formId: selectedForm.id, data: formData }),
                credentials: 'include' // Important for cookie
            });

            if (res.ok) {
                const report = await res.json();
                setReportSummary(report.aiSummary);
                toast.success('Report submitted successfully!');
            } else {
                toast.error('Failed to submit report');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    if (reportSummary) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle2 size={32} />
                    <h2 className="text-2xl font-bold">Submission Complete</h2>
                </div>

                <Card className="border-t-4 border-t-blue-500 shadow-lg">
                    <CardHeader>
                        <CardTitle>AI Analysis Report</CardTitle>
                        <CardDescription>Instant evaluation of your inspection data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 leading-relaxed font-medium">
                            {reportSummary}
                        </div>
                        <Button className="w-full h-12 text-lg" onClick={() => { setReportSummary(null); setSelectedForm(null); setFormData({}); }}>
                            Start New Inspection
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!selectedForm) {
        return (
            <div className="space-y-8">
                <div className='flex justify-between items-center'>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Start Inspection</h2>
                        <p className="text-gray-500">Select a checklist to begin a new audit.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {forms.map((form) => (
                        <Card key={form.id} className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-green-500 hover:-translate-y-1" onClick={() => setSelectedForm(form)}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <FileEdit className="w-6 h-6 text-green-600" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
                                </div>
                                <CardTitle className="text-lg group-hover:text-green-700 transition-colors">{form.title}</CardTitle>
                                <CardDescription>Tap to open checklist</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                    {forms.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                            <p className="text-gray-500">No inspection forms available. Ask Admin to create one.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Parse structure if it's a string (from DB JSON) or object
    const fields = typeof selectedForm.structure === 'string' ? JSON.parse(selectedForm.structure) : selectedForm.structure;

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedForm(null)} className="mb-4 pl-0 hover:bg-transparent text-gray-500 hover:text-gray-900">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Forms
            </Button>

            <Card className="shadow-lg border-0">
                <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl">{selectedForm.title} Inspection</CardTitle>
                    <CardDescription>Fill out all required fields carefully.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {Array.isArray(fields) && fields.map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name} className="text-base font-semibold text-gray-700">{field.label}</Label>
                                {field.type === 'number' ? (
                                    <Input
                                        id={field.name}
                                        type="number"
                                        placeholder={field.placeholder}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        required={field.required}
                                        className="h-12 text-lg"
                                    />
                                ) : (
                                    <Select onValueChange={(val) => handleInputChange(field.name, val)}>
                                        <SelectTrigger className="h-12 text-lg">
                                            <SelectValue placeholder="Select Answer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                            <SelectItem value="N/A">N/A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Submit Report'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
