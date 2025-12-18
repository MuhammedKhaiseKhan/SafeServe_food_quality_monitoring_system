'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { BookOpen, Plus, ShieldAlert, AlertTriangle, Info, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminGuidelinesPage() {
    const [guidelines, setGuidelines] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        severity: 'Minor'
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchGuidelines = async () => {
        try {
            const res = await fetch('http://localhost:4000/guidelines', {
                credentials: 'include'
            });
            if (res.ok) setGuidelines(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGuidelines();
    }, []);

    const handleEdit = (guideline: any) => {
        setFormData({
            title: guideline.title,
            content: guideline.content,
            category: guideline.category,
            severity: guideline.severity
        });
        setEditingId(guideline.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        toast("Are you sure you want to delete this guideline?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    const res = await fetch(`http://localhost:4000/guidelines/${id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (res.ok) {
                        toast.success('Guideline deleted');
                        fetchGuidelines();
                    } else {
                        toast.error('Failed to delete guideline');
                    }
                }
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId
            ? `http://localhost:4000/guidelines/${editingId}`
            : 'http://localhost:4000/guidelines';

        const method = editingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        if (res.ok) {
            toast.success(`Guideline ${editingId ? 'updated' : 'created'} successfully`);
            setFormData({ title: '', content: '', category: 'General', severity: 'Minor' });
            setIsCreating(false);
            setEditingId(null);
            fetchGuidelines();
        } else {
            toast.error(`Failed to ${editingId ? 'update' : 'create'} guideline`);
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', content: '', category: 'General', severity: 'Minor' });
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'Critical': return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 flex gap-1"><ShieldAlert size={12} /> Critical</Badge>;
            case 'Major': return <Badge className="bg-amber-500 hover:bg-amber-600 flex gap-1"><AlertTriangle size={12} /> Major</Badge>;
            default: return <Badge variant="secondary" className="flex gap-1"><Info size={12} /> Minor</Badge>;
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Safety Standards</h2>
                    <p className="text-gray-500">Define and manage food safety protocols for your organization.</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className={isCreating ? "hidden" : "bg-green-600 hover:bg-green-700"}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Guideline
                </Button>
            </div>

            {isCreating && (
                <Card className="border-l-4 border-l-green-500 shadow-md animate-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Standard' : 'Create New Standard'}</CardTitle>
                        <CardDescription>{editingId ? 'Modify existing safety protocol.' : 'Publish a new regulation for all kitchens.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Hand Washing Protocol"
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General">General Safety</SelectItem>
                                            <SelectItem value="Hygiene">Personal Hygiene</SelectItem>
                                            <SelectItem value="Storage">Food Storage</SelectItem>
                                            <SelectItem value="Preparation">Preparation</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Severity Level</Label>
                                <div className="flex gap-4 p-4 border rounded-lg bg-gray-50/50">
                                    {['Minor', 'Major', 'Critical'].map((level) => (
                                        <label key={level} className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors ${formData.severity === level ? 'bg-white shadow-sm ring-1 ring-gray-200' : ''}`}>
                                            <input
                                                type="radio"
                                                name="severity"
                                                value={level}
                                                checked={formData.severity === level}
                                                onChange={() => setFormData({ ...formData, severity: level })}
                                                className="accent-green-600"
                                            />
                                            <span className="text-sm font-medium">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Detailed Content</Label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Describe the standard operating procedure..."
                                    required
                                    className="min-h-[150px] resize-y text-base"
                                />
                                <p className="text-xs text-gray-500">Supports simple text formatting.</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 min-w-[120px]">{editingId ? 'Update Guideline' : 'Publish Guideline'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guidelines.map(g => (
                    <Card key={g.id} className="group hover:shadow-lg transition-all duration-300 flex flex-col h-full border-gray-200">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                {getSeverityBadge(g.severity)}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button onClick={() => handleEdit(g)} variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600"><Edit2 size={14} /></Button>
                                    <Button onClick={() => handleDelete(g.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600"><Trash2 size={14} /></Button>
                                </div>
                            </div>
                            <CardTitle className="leading-snug text-lg">{g.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <BookOpen size={12} /> {g.category}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{g.content}</p>
                        </CardContent>
                        <div className="h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:via-green-200 transition-all duration-500" />
                    </Card>
                ))}

                {guidelines.length === 0 && !isCreating && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <BookOpen size={48} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-500">No guidelines established yet.</p>
                        <Button variant="link" onClick={() => setIsCreating(true)} className="text-green-600">Create your first standard</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
