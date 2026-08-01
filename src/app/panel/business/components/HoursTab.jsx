'use client'

import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { Save } from "lucide-react";

const DAYS_OF_WEEK = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

export default function HoursTab({ userId, businessData, sucursalesData }) {
    const queryClient = useQueryClient();
    const [selectedSucursalIdForHours, setSelectedSucursalIdForHours] = useState('main');

    const [hours, setHours] = useState(
        Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            openTime: "08:00",
            closeTime: "20:00",
            isOpen: true
        }))
    );

    useEffect(() => {
        if (businessData?.status && businessData.rest.restaurantHours) {
            const targetId = selectedSucursalIdForHours === 'main' ? null : Number(selectedSucursalIdForHours);
            const branchHours = businessData.rest.restaurantHours.filter(h => h.sucursalId === targetId);

            if (branchHours.length > 0) {
                const sortedHours = [...branchHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
                setHours(sortedHours);
            } else {
                setHours(Array.from({ length: 7 }, (_, i) => ({
                    dayOfWeek: i,
                    openTime: "08:00",
                    closeTime: "20:00",
                    isOpen: true
                })));
            }
        }
    }, [businessData, selectedSucursalIdForHours]);

    const hoursMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/user/business/hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    restaurantId: businessData?.rest?.id, 
                    sucursalId: selectedSucursalIdForHours === 'main' ? null : Number(selectedSucursalIdForHours), 
                    hours 
                })
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.status) {
                toast.success("Horarios actualizados");
                queryClient.invalidateQueries({ queryKey: ['business', userId] });
            } else {
                toast.error(data.message);
            }
        },
        onError: () => {
            toast.error("Error al guardar horarios");
        }
    });

    const saveHours = () => {
        if (!businessData?.rest?.id) return toast.error("Crea tu negocio primero");
        hoursMutation.mutate();
    }

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Configurar horarios para:</label>
                <select
                    value={selectedSucursalIdForHours}
                    onChange={(e) => setSelectedSucursalIdForHours(e.target.value)}
                    className="flex h-10 w-full md:w-1/3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                >
                    <option value="main">Restaurante Principal</option>
                    {sucursalesData?.data?.map(sucursal => (
                        <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="grid gap-4">
                {hours.map((day, idx) => (
                    <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${day.isOpen ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10' : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'}`}>
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-colors ${day.isOpen ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}`}>
                                {DAYS_OF_WEEK[day.dayOfWeek].charAt(0)}
                            </div>
                            <div>
                                <h3 className={`font-semibold ${day.isOpen ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>{DAYS_OF_WEEK[day.dayOfWeek]}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${day.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {day.isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">Apertura</span>
                                    <input
                                        type="time"
                                        disabled={!day.isOpen}
                                        value={day.openTime}
                                        onChange={(e) => {
                                            const newHours = [...hours];
                                            newHours[idx].openTime = e.target.value;
                                            setHours(newHours);
                                        }}
                                        className={`border-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none ${day.isOpen ? 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white' : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'}`}
                                    />
                                </div>
                                <span className="text-gray-400 mt-5 font-bold"> - </span>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">Cierre</span>
                                    <input
                                        type="time"
                                        disabled={!day.isOpen}
                                        value={day.closeTime}
                                        onChange={(e) => {
                                            const newHours = [...hours];
                                            newHours[idx].closeTime = e.target.value;
                                            setHours(newHours);
                                        }}
                                        className={`border-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none ${day.isOpen ? 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white' : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'}`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Estado</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newHours = [...hours];
                                        newHours[idx].isOpen = !newHours[idx].isOpen;
                                        setHours(newHours);
                                    }}
                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${day.isOpen ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${day.isOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4 border-t">
                <button onClick={saveHours} disabled={hoursMutation.isPending} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 gap-2">
                    <Save size={18} />
                    {hoursMutation.isPending ? 'Guardando...' : 'Guardar Horarios'}
                </button>
            </div>
        </div>
    )
}
