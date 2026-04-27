'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SucursalSelector({ sucursales }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [selectedSucursal, setSelectedSucursal] = useState('');

    useEffect(() => {
        const sucursalId = searchParams.get('sucursal');
        if (sucursalId) {
            setSelectedSucursal(sucursalId);
        } else {
            setSelectedSucursal('');
        }
    }, [searchParams]);

    const handleSelect = (e) => {
        const id = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (id) {
            params.set('sucursal', id);
        } else {
            params.delete('sucursal');
        }
        router.push(`${pathname}?${params.toString()}`);
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
                    <option value="">Todas las sucursales</option>
                    {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                            {sucursal.nombre}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}
