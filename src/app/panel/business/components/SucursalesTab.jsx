'use client'

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Edit2, Plus, MapPin, Truck, Save, Building2, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/lib/hooks";
import { addSucursalInAuth, updateSucursalInAuth, removeSucursalFromAuth } from "@/lib/features/auth/authSlice";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">Cargando mapa...</div>
});

export default function SucursalesTab({ businessData, sucursalesData }) {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const [isEditingSucursal, setIsEditingSucursal] = useState(null);
    const [sucursalForm, setSucursalForm] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        lat: null,
        lng: null,
        deliveryFreeRange: '',
        deliveryShortRange: '',
        deliveryShortPrice: '',
        deliveryMediumRange: '',
        deliveryMediumPrice: '',
        deliveryLongRange: '',
        deliveryLongPrice: ''
    });

    const sucursalMutation = useMutation({
        mutationFn: async () => {
            const url = isEditingSucursal
                ? `/api/user/business/sucursales/${isEditingSucursal}`
                : '/api/user/business/sucursales';
            const method = isEditingSucursal ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: businessData?.rest?.id,
                    ...sucursalForm
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success(isEditingSucursal ? "Sucursal actualizada" : "Sucursal agregada");
                if (data.data) {
                    if (isEditingSucursal) {
                        dispatch(updateSucursalInAuth({ id: data.data.id, nombre: data.data.nombre }));
                    } else {
                        dispatch(addSucursalInAuth({ id: data.data.id, nombre: data.data.nombre }));
                    }
                }
                setSucursalForm({ nombre: '', direccion: '', telefono: '', lat: null, lng: null, deliveryFreeRange: '', deliveryShortRange: '', deliveryShortPrice: '', deliveryMediumRange: '', deliveryMediumPrice: '', deliveryLongRange: '', deliveryLongPrice: '' });
                setIsEditingSucursal(null);
                queryClient.invalidateQueries({ queryKey: ['sucursales', businessData?.rest?.id] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al procesar sucursal");
        }
    });

    const handleSucursalSubmit = (e) => {
        e.preventDefault();
        if (!businessData?.rest?.id) return toast.error("Crea tu negocio primero");
        sucursalMutation.mutate();
    }

    const deleteSucursalMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/user/business/sucursales/${id}`, { method: 'DELETE' });
            return res.json();
        },
        onSuccess: (data, id) => {
            if (data.status) {
                toast.success("Sucursal eliminada");
                dispatch(removeSucursalFromAuth(id));
                queryClient.invalidateQueries({ queryKey: ['sucursales', businessData?.rest?.id] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al eliminar sucursal");
        }
    });

    const deleteSucursal = (id) => {
        if (!confirm("¿Eliminar esta sucursal?")) return;
        deleteSucursalMutation.mutate(id);
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {isEditingSucursal ? <Edit2 size={18} /> : <Plus size={18} />}
                    {isEditingSucursal ? 'Editar Sucursal' : 'Agregar Nueva Sucursal'}
                </h3>
                <form onSubmit={handleSucursalSubmit} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre de la Sucursal</label>
                        <input
                            type="text"
                            value={sucursalForm.nombre}
                            onChange={(e) => setSucursalForm({ ...sucursalForm, nombre: e.target.value })}
                            placeholder="Ej. Sucursal Centro"
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Teléfono</label>
                        <input
                            type="text"
                            value={sucursalForm.telefono || ''}
                            onChange={(e) => setSucursalForm({ ...sucursalForm, telefono: e.target.value })}
                            placeholder="Ej. +58 414 1234567"
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium">Dirección</label>
                        <textarea
                            value={sucursalForm.direccion}
                            onChange={(e) => setSucursalForm({ ...sucursalForm, direccion: e.target.value })}
                            placeholder="Dirección completa"
                            rows={2}
                            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <MapPin size={16} className="text-red-500" />
                            Ubicación en el Mapa (Opcional)
                        </label>
                        <MapPicker
                            lat={sucursalForm.lat}
                            lng={sucursalForm.lng}
                            onChange={(lat, lng) => setSucursalForm({ ...sucursalForm, lat, lng })}
                        />
                    </div>

                    <div className="md:col-span-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h4 className="text-md font-semibold flex items-center gap-2 mb-4">
                            <Truck size={18} className="text-blue-600" />
                            Costos de Delivery de la Sucursal
                        </h4>
                        <div className="grid gap-4">
                            <div className="p-3 rounded-xl border border-green-100 bg-green-50/30 grid md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-green-800">Distancia Gratis (Hasta km)</label>
                                    <input type="number" value={sucursalForm.deliveryFreeRange} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryFreeRange: e.target.value })} placeholder="Ej: 2" className="flex h-9 w-full rounded-md border border-green-200 bg-white px-3 py-1 text-sm" />
                                </div>
                            </div>
                            <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-blue-800">Distancia Corta (km)</label>
                                    <input type="number" value={sucursalForm.deliveryShortRange} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryShortRange: e.target.value })} className="flex h-9 w-full rounded-md border border-blue-200 bg-white px-3 py-1 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-blue-800">Precio Corta</label>
                                    <input type="number" value={sucursalForm.deliveryShortPrice} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryShortPrice: e.target.value })} className="flex h-9 w-full rounded-md border border-blue-200 bg-white px-3 py-1 text-sm" />
                                </div>
                            </div>
                            <div className="p-3 rounded-xl border border-yellow-100 bg-yellow-50/30 grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-yellow-800">Distancia Mediana (km)</label>
                                    <input type="number" value={sucursalForm.deliveryMediumRange} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryMediumRange: e.target.value })} className="flex h-9 w-full rounded-md border border-yellow-200 bg-white px-3 py-1 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-yellow-800">Precio Mediana</label>
                                    <input type="number" value={sucursalForm.deliveryMediumPrice} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryMediumPrice: e.target.value })} className="flex h-9 w-full rounded-md border border-yellow-200 bg-white px-3 py-1 text-sm" />
                                </div>
                            </div>
                            <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/30 grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-orange-800">Distancia Larga (Más de km)</label>
                                    <input type="number" value={sucursalForm.deliveryLongRange} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryLongRange: e.target.value })} className="flex h-9 w-full rounded-md border border-orange-200 bg-white px-3 py-1 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-orange-800">Precio Larga</label>
                                    <input type="number" value={sucursalForm.deliveryLongPrice} onChange={(e) => setSucursalForm({ ...sucursalForm, deliveryLongPrice: e.target.value })} className="flex h-9 w-full rounded-md border border-orange-200 bg-white px-3 py-1 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                        {isEditingSucursal && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingSucursal(null);
                                    setSucursalForm({ nombre: '', direccion: '', telefono: '', lat: null, lng: null });
                                }}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}
                        <button type="submit" disabled={sucursalMutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                            {isEditingSucursal ? <Save size={16} /> : <Plus size={16} />}
                            {sucursalMutation.isPending ? 'Cargando...' : isEditingSucursal ? 'Actualizar' : 'Agregar Sucursal'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Mis Sucursales</h3>
                {!sucursalesData?.data || sucursalesData.data.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No tienes sucursales registradas.</p>
                ) : (
                    <div className="grid gap-3">
                        {sucursalesData.data.map((sucursal) => (
                            <div key={sucursal.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-600">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{sucursal.nombre}</h4>
                                        <p className="text-xs text-gray-500">{sucursal.direccion}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditingSucursal(sucursal.id);
                                            setSucursalForm({
                                                nombre: sucursal.nombre,
                                                direccion: sucursal.direccion,
                                                telefono: sucursal.telefono || '',
                                                lat: sucursal.lat,
                                                lng: sucursal.lng,
                                                deliveryFreeRange: sucursal.deliveryFreeRange || '',
                                                deliveryShortRange: sucursal.deliveryShortRange || '',
                                                deliveryShortPrice: sucursal.deliveryShortPrice || '',
                                                deliveryMediumRange: sucursal.deliveryMediumRange || '',
                                                deliveryMediumPrice: sucursal.deliveryMediumPrice || '',
                                                deliveryLongRange: sucursal.deliveryLongRange || '',
                                                deliveryLongPrice: sucursal.deliveryLongPrice || ''
                                            });
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteSucursal(sucursal.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
