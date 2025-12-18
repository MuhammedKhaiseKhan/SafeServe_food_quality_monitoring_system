'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormField {
    name: string;
    label: string;
    type: string;
}

interface InspectionForm {
    id: number;
    title: string;
    structure: FormField[];
}

export default function AdminFormsPage() {
    const [forms, setForms] = useState<InspectionForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [fields, setFields] = useState<FormField[]>([]);
    const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });

    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/forms`, {
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setForms(data);
            }
        } catch (error) {
            toast.error('Failed to fetch forms');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsCreating(true); // Explicitly creating
        setTitle('');
        setFields([]);
        setNewField({ name: '', label: '', type: 'text' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = (form: InspectionForm) => {
        setIsCreating(false);
        setEditingId(form.id);
        setTitle(form.title);
        // Ensure structure is an array
        setFields(Array.isArray(form.structure) ? form.structure : []);
        setNewField({ name: '', label: '', type: 'text' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addField = () => {
        if (!newField.name || !newField.label) return;
        setFields([...fields, newField]);
        setNewField({ name: '', label: '', type: 'text' });
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        const url = editingId
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/forms/${editingId}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/forms`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, structure: fields }),
                credentials: 'include'
            });

            if (res.ok) {
                toast.success(editingId ? 'Form updated successfully' : 'Form created successfully');
                fetchForms();
                setIsCreating(false);
                setEditingId(null);
            } else {
                toast.error('Failed to save form');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleDelete = (id: number) => {
        toast('Are you sure?', {
            description: 'This will permanently delete the form and its reports.',
            action: {
                label: 'Delete',
                onClick: () => confirmDelete(id),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => console.log('Cancelled'),
            }
        });
    };

    const confirmDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/forms/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Form deleted successfully');
                fetchForms();
                if (editingId === id) {
                    setEditingId(null);
                    setIsCreating(false);
                }
            } else {
                toast.error('Failed to delete form');
            }
        } catch (error) {
            toast.error('Failed to delete form');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
    };

    const showEditor = isCreating || editingId !== null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    {showEditor ? (
                        <>
                            <Button variant="ghost" size="icon" onClick={handleCancel}><ArrowLeft size={20} /></Button>
                            {editingId ? 'Edit Form' : 'New Form'}
                        </>
                    ) : (
                        'Manage Inspection Forms'
                    )}
                </h2>
                {!showEditor && (
                    <Button onClick={resetForm}>
                        <Plus size={16} className="mr-2" /> New Form
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form List Sidebar */}
                <div className={`lg:col-span-1 space-y-4 ${showEditor ? 'hidden lg:block' : 'block'}`}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Forms</CardTitle>
                            <CardDescription>Select a form to edit</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {isLoading ? (
                                <p className="text-sm text-gray-500">Loading...</p>
                            ) : forms.length === 0 ? (
                                <Alert>
                                    <AlertTitle>No Forms Found</AlertTitle>
                                    <AlertDescription>Create your first inspection form to get started.</AlertDescription>
                                </Alert>
                            ) : (
                                forms.map(form => (
                                    <div
                                        key={form.id}
                                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center ${editingId === form.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}
                                        onClick={() => handleEdit(form)}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{form.title}</p>
                                            <p className="text-xs text-gray-500">{Array.isArray(form.structure) ? form.structure.length : 0} fields</p>
                                        </div>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => handleEdit(form)}>
                                                <Pencil size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(form.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Area */}
                <div className={`lg:col-span-2 ${showEditor ? 'block' : 'hidden lg:block'}`}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit Form' : 'Create New Form'}</CardTitle>
                            <CardDescription>Define the structure of your inspection checklist.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {(showEditor || forms.length === 0) ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Form Title</Label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Hygiene Check" />
                                    </div>

                                    <div className="border p-4 rounded-lg space-y-4 bg-gray-50/50">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-sm">Form Fields</h3>
                                            <span className="text-xs text-gray-500">{fields.length} fields added</span>
                                        </div>

                                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                            {fields.length === 0 && (
                                                <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed rounded-lg">
                                                    No fields added yet. Add one below.
                                                </div>
                                            )}
                                            {fields.map((f, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded border shadow-sm group">
                                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                                        <div className="text-sm"><span className="font-medium">Label:</span> {f.label}</div>
                                                        <div className="text-sm text-gray-500"><span className="font-medium text-gray-700">ID:</span> {f.name}</div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeField(i)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t mt-4">
                                            <Label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Add New Field</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end">
                                                <div className="md:col-span-3 space-y-1">
                                                    <Label className="text-xs">Field ID (unique)</Label>
                                                    <Input className="h-8 text-sm" placeholder="e.g. temp_fridge" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} />
                                                </div>
                                                <div className="md:col-span-3 space-y-1">
                                                    <Label className="text-xs">Label</Label>
                                                    <Input className="h-8 text-sm" placeholder="e.g. Fridge Temp" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <Button size="sm" onClick={addField} className="w-full h-8" disabled={!newField.name || !newField.label}>Add</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        {showEditor && (
                                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                        )}
                                        <Button onClick={handleSave} disabled={!title || fields.length === 0} className="w-full md:w-auto min-w-[150px]">
                                            {editingId ? 'Update Form' : 'Create Form'}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                    <p>Select a form to edit details</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
