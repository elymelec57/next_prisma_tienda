'use client'

import { useEffect, useState } from 'react';
import { useAppSelector } from "@/lib/hooks";
import {
    Loader2,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    DollarSign,
    User,
    Package,
    MessageSquare
} from 'lucide-react';
import Modal from '@/components/Modal';

export default function Orders() {

    const id = useAppSelector((state) => state.auth.auth.id)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async () => {
        try {
            const res = await fetch(`/api/user/orders/user/${id}`)
            if (res.ok) {
                const { orders } = await res.json()
                setOrders(orders || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleViewDetails = async (orderId) => {
        try {
            const res = await fetch(`/api/user/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedOrder(data);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    const getStatusBadge = (status, estado) => {
        const isProcessed = status === true;

        if (isProcessed) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completado
                </span>
            );
        }

        return (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/30">
                <Clock className="mr-1 h-3 w-3" />
                En Proceso
            </span>
        );
    };

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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Pedidos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Monitorea y gestiona los pedidos realizados en tu restaurante.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Fecha</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Total</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Estado</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500 dark:text-gray-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders.length > 0 ? (
                                orders.map((o) => (
                                    <tr key={o.id} className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                                        <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                            #{o.id}
                                        </td>
                                        <td className="p-4 align-middle hidden sm:table-cell text-gray-500 dark:text-gray-400">
                                            {new Date(o.fechaHora).toLocaleDateString()} {new Date(o.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 align-middle font-semibold text-gray-900 dark:text-gray-100">
                                            ${o.total?.toFixed(2)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {getStatusBadge(o.status, o.estado)}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <button
                                                onClick={() => handleViewDetails(o.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                            >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                                <span className="sr-only">Ver detalles</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron pedidos recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Detalle de Pedido #${selectedOrder.id}` : "Cargando..."}
                maxWidth="max-w-3xl"
            >
                {selectedOrder && (
                    <div className="space-y-6 pt-2">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    Fecha y Hora
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {new Date(selectedOrder.fechaHora).toLocaleString()}
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                                    Total Pagado
                                </div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    ${selectedOrder.total?.toFixed(2)}
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    <User className="mr-1.5 h-3.5 w-3.5" />
                                    Cliente
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {selectedOrder.cliente ? selectedOrder.cliente.nombre : 'Consumidor Final'}
                                </div>
                                {selectedOrder.cliente?.telefono && (
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{selectedOrder.cliente.telefono}</div>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase font-medium border-b border-gray-200 dark:border-gray-800">
                                    <tr>
                                        <th className="px-4 py-3">Plato</th>
                                        <th className="px-4 py-3 text-center">Cant.</th>
                                        <th className="px-4 py-3 text-right">Precio</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {selectedOrder.items?.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    <Package className="h-3.5 w-3.5 text-gray-400" />
                                                    {item.plato?.nombre || "Producto"}
                                                </div>
                                                {item.nota && (
                                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1 bg-amber-50/50 dark:bg-amber-900/10 p-1.5 rounded border border-amber-100/50 dark:border-amber-800/20">
                                                        <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                                        <span>{item.nota}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-medium">{item.cantidad}</td>
                                            <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-mono">${item.precioUnitario?.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white font-mono">
                                                ${(item.cantidad * item.precioUnitario).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-800 font-semibold">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-4 text-right text-gray-600 dark:text-gray-300">Total del Pedido</td>
                                        <td className="px-4 py-4 text-right text-lg text-gray-900 dark:text-white font-mono">
                                            ${selectedOrder.total?.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Footer / Actions inside modal */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium border border-gray-200 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-800"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
