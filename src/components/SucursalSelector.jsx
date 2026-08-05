'use client'
import { MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { authSlice } from "@/lib/features/auth/authSlice";

export default function SucursalSelector({ sucursales }) {
    const dispatch = useAppDispatch();
    const [selectedSucursal, setSelectedSucursal] = useState('');

    const selectSucursal = useAppSelector((state) => state.auth.selectedSucursalBuy);
    useEffect(() => {
        if (selectSucursal) {
            setSelectedSucursal(selectSucursal);
        }
    }, [selectSucursal]);

    const handleSelect = (e) => {
        setSelectedSucursal(e.target.value);
        dispatch(authSlice.actions.selectedSucursalBuy(e.target.value));
    };

    if (!sucursales || sucursales.length === 0) return null;

    return (
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2 shadow-sm">
            <MapPin className="h-4 w-4 text-orange-500" />
            <div className="relative">
                <select
                    value={selectedSucursal}
                    onChange={handleSelect}
                    className="appearance-none bg-transparent pr-8 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="">Elige una sucursal</option>
                    <option value={JSON.stringify({ id: 'main', nombre: 'Rest. Principal' })}>Rest. Principal</option>
                    {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={JSON.stringify({ id: sucursal.id, nombre: sucursal.nombre })}>
                            {sucursal.nombre}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}
