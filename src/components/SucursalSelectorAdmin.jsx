"use client"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { authSlice } from "@/lib/features/auth/authSlice";

export default function SucursalSelectorAdmin() {

    const sucursales = useAppSelector((state) => state.auth.auth.sucursales);
    const dispatch = useAppDispatch();
    const [selectedSucursal, setSelectedSucursal] = useState('main');
    const handleSelect = (e) => {
        setSelectedSucursal(e.target.value);
        dispatch(authSlice.actions.selectedSucursal(e.target.value));
    };

    return (
        <div>
            {sucursales.length > 0 && (
                <div className="w-full sm:w-40">
                    <select
                        value={selectedSucursal}
                        onChange={(e) => handleSelect(e)}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    >
                        <option value={JSON.stringify({ id: 'main', nombre: 'Rest. Principal' })}>Rest. Principal</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={JSON.stringify({ id: sucursal.id, nombre: sucursal.nombre })}>{sucursal.nombre}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}