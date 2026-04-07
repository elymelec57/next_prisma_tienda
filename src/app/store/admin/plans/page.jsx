'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Save, X, List } from "lucide-react";
import { useState } from "react";

export default function AdminPlans() {
    const queryClient = useQueryClient();
    const [editingPlan, setEditingPlan] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: 0, productLimit: 10 });

    const { data: plans, isLoading } = useQuery({
        queryKey: ['admin-plans'],
        queryFn: async () => {
            const res = await fetch('/api/admin/plans');
            return res.json();
        }
    });

    const mutation = useMutation({
        mutationFn: async (planData) => {
            const url = planData.id ? `/api/admin/plans/${planData.id}` : '/api/admin/plans';
            const method = planData.id ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            toast.success("Plan guardado");
            setEditingPlan(null);
            setForm({ name: '', description: '', price: 0, productLimit: 10 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            toast.success("Plan eliminado");
        }
    });

    if (isLoading) return <div className="p-8 text-center">Cargando planes...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2"><List /> Gestión de Planes</h1>
                <button
                    onClick={() => { setEditingPlan('new'); setForm({ name: '', description: '', price: 0, productLimit: 10 }); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Nuevo Plan
                </button>
            </div>

            {(editingPlan || editingPlan === 'new') && (
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="font-semibold">{editingPlan === 'new' ? 'Crear Nuevo Plan' : 'Editar Plan'}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            placeholder="Nombre"
                            className="border p-2 rounded"
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            className="border p-2 rounded"
                            value={form.price}
                            onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                        />
                        <input
                            type="number"
                            placeholder="Límite de Productos"
                            className="border p-2 rounded"
                            value={form.productLimit}
                            onChange={e => setForm({...form, productLimit: parseInt(e.target.value)})}
                        />
                        <textarea
                            placeholder="Descripción"
                            className="border p-2 rounded md:col-span-2"
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingPlan(null)} className="px-4 py-2 border rounded">Cancelar</button>
                        <button
                            onClick={() => mutation.mutate(editingPlan === 'new' ? form : { ...form, id: editingPlan })}
                            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                        >
                            <Save size={18} /> Guardar
                        </button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {plans?.map(plan => (
                    <div key={plan.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{plan.name} - ${plan.price}</h3>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Límite: {plan.productLimit}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setEditingPlan(plan.id); setForm(plan); }}
                                className="p-2 text-gray-400 hover:text-blue-600"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => confirm("¿Eliminar?") && deleteMutation.mutate(plan.id)}
                                className="p-2 text-gray-400 hover:text-red-600"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
