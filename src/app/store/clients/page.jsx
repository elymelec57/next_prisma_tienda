'use client'

import { useEffect, useState } from 'react';
import { useAppSelector } from "@/lib/hooks";
import {
    Loader2,
    User,
    Phone,
    Mail,
    Search,
    MoreHorizontal,
    Plus,
    UserCircle
} from 'lucide-react';

export default function Clients() {

    const id = useAppSelector((state) => state.auth.auth.id)
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getClients();
    }, [])

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.telefono?.includes(searchTerm)
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    const getClients = async () => {
        try {
            const res = await fetch(`/api/user/clients/user/${id}`)
            if (res.ok) {
                const { restaurant } = await res.json()
                const clientList = restaurant.cliente || [];
                setClients(clientList);
                setFilteredClients(clientList);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Clientes</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Mantén un registro de tus clientes habituales y su información de contacto.
                    </p>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {filteredClients.length} {filteredClients.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr className="border-b transition-colors dark:border-gray-800">
                                <th className="h-12 px-6 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Nombre</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Contacto</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-gray-500 dark:text-gray-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                                                    <UserCircle className="h-6 w-6" />
                                                </div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {client.nombre}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="space-y-1">
                                                {client.telefono && (
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Phone className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                                        {client.telefono}
                                                    </div>
                                                )}
                                                {client.email && (
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <Mail className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                                        {client.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Opciones</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <User className="h-12 w-12 text-gray-200 mb-4" />
                                            <p className="text-lg font-medium">No se encontraron clientes</p>
                                            <p className="text-sm">Intenta con otros términos de búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
