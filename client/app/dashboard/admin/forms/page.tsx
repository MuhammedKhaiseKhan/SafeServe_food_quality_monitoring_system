'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminFormsPage() {
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState<{ name: string, label: string, type: string }[]>([]);
    const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });

    const addField = () => {
        if (!newField.name || !newField.label) return;
        setFields([...fields, newField]);
        setNewField({ name: '', label: '', type: 'text' });
    };

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title, structure: fields }),
        });
        if (res.ok) {
            toast.success('Form created successfully');
            setTitle('');
            setFields([]);
        } else {
            toast.error('Failed to create form');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Inspection Forms</h2>

            <Card>
                <CardHeader><CardTitle>Create New Form</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Form Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Hygiene Check" />
                    </div>

                    <div className="border p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold">Add Fields</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Input placeholder="Field ID (e.g. temp_fridge)" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
                            <Input placeholder="Label (e.g. Fridge Temperature)" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} />
                            <Button onClick={addField}>Add Field</Button>
                        </div>

                        <div className="mt-4">
                            {fields.map((f, i) => (
                                <div key={i} className="flex justify-between bg-gray-50 p-2 rounded mb-2">
                                    <span>{f.label} ({f.name})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleCreate} disabled={!title || fields.length === 0} className="w-full">Create Form</Button>
                </CardContent>
            </Card>
        </div>
    );
}
