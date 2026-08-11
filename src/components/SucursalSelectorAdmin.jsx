"use client"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { authSlice } from "@/lib/features/auth/authSlice";

export default function SucursalSelectorAdmin() {
    const sucursales = useAppSelector((state) => state.auth.auth?.sucursales) || [];
    const currentSucursal = useAppSelector((state) => state.auth.selectedSucursal);
    const dispatch = useAppDispatch();

    const getSelectedValue = () => {
        if (!currentSucursal || !currentSucursal.id || String(currentSucursal.id) === 'main') {
            return JSON.stringify({ id: 'main', nombre: 'Rest. Principal' });
        }
        const found = sucursales.find(s => String(s.id) === String(currentSucursal.id));
        if (found) {
            return JSON.stringify({ id: found.id, nombre: found.nombre });
        }
        return JSON.stringify({ id: currentSucursal.id, nombre: currentSucursal.nombre });
    };

    const handleSelect = (e) => {
        dispatch(authSlice.actions.selectedSucursal(e.target.value));
    };

    return (
        <div>
            {sucursales.length > 0 && (
                <div className="w-full sm:w-40">
                    <select
                        value={getSelectedValue()}
                        onChange={handleSelect}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    >
                        <option value={JSON.stringify({ id: 'main', nombre: 'Rest. Principal' })}>Rest. Principal</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={JSON.stringify({ id: sucursal.id, nombre: sucursal.nombre })}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}