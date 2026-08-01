'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Edit2, Plus, Save, Banknote, Trash2 } from "lucide-react";

export default function CajasTab({ businessData, sucursalesData }) {
    const queryClient = useQueryClient();
    const restaurantId = businessData?.rest?.id;

    const [isEditingCaja, setIsEditingCaja] = useState(null);
    const [cajaForm, setCajaForm] = useState({
        nombre: '',
        sucursalId: ''
    });

    const { data: cajasData } = useQuery({
        queryKey: ['cajas', restaurantId],
        queryFn: async () => {
            const res = await fetch(`/api/user/business/cajas?restaurantId=${restaurantId}`);
            return res.json();
        },
        enabled: !!restaurantId,
    });

    const cajaMutation = useMutation({
        mutationFn: async () => {
            const url = isEditingCaja
                ? `/api/user/business/cajas/${isEditingCaja}`
                : '/api/user/business/cajas';
            const method = isEditingCaja ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId,
                    ...cajaForm
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(isEditingCaja ? "Caja actualizada" : "Caja agregada");
                setCajaForm({ nombre: '', sucursalId: '' });
                setIsEditingCaja(null);
                queryClient.invalidateQueries({ queryKey: ['cajas', restaurantId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al procesar caja");
        }
    });

    const handleCajaSubmit = (e) => {
        e.preventDefault();
        if (!restaurantId) return toast.error("Crea tu negocio primero");
        cajaMutation.mutate();
    }

    const deleteCajaMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/user/business/cajas/${id}`, { method: 'DELETE' });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("Caja eliminada");
                queryClient.invalidateQueries({ queryKey: ['cajas', restaurantId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al eliminar caja");
        }
    });

    const deleteCaja = (id) => {
        if (!confirm("¿Eliminar esta caja?")) return;
        deleteCajaMutation.mutate(id);
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {isEditingCaja ? <Edit2 size={18} /> : <Plus size={18} />}
                    {isEditingCaja ? 'Editar Caja' : 'Agregar Nueva Caja'}
                </h3>
                <form onSubmit={handleCajaSubmit} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre de la Caja</label>
                        <input
                            type="text"
                            value={cajaForm.nombre}
                            onChange={(e) => setCajaForm({ ...cajaForm, nombre: e.target.value })}
                            placeholder="Ej. Caja Principal, Caja Delivery"
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Asignar a Sucursal</label>
                        <select
                            value={cajaForm.sucursalId}
                            onChange={(e) => setCajaForm({ ...cajaForm, sucursalId: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        >
                            <option value="">Restaurante Principal</option>
                            {sucursalesData?.data?.map(suc => (
                                <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        {isEditingCaja && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingCaja(null);
                                    setCajaForm({ nombre: '', sucursalId: '' });
                                }}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}
                        <button type="submit" disabled={cajaMutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                            {isEditingCaja ? <Save size={16} /> : <Plus size={16} />}
                            {cajaMutation.isPending ? 'Cargando...' : isEditingCaja ? 'Actualizar' : 'Agregar Caja'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Mis Cajas</h3>
                {!cajasData?.data || cajasData.data.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No tienes cajas registradas.</p>
                ) : (
                    <div className="grid gap-3">
                        {cajasData.data.map((caja) => (
                            <div key={caja.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-green-600">
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{caja.nombre}</h4>
                                        <p className="text-xs text-gray-500">
                                            {caja.sucursal ? `Sucursal: ${caja.sucursal.nombre}` : 'Restaurante Principal'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${caja.estado === 'Abierta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {caja.estado}
                                    </span>
                                    <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-4">
                                        <button
                                            onClick={() => {
                                                setIsEditingCaja(caja.id);
                                                setCajaForm({
                                                    nombre: caja.nombre,
                                                    sucursalId: caja.sucursalId || ''
                                                });
                                            }}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteCaja(caja.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
