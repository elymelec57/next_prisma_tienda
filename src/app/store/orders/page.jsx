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
    MessageSquare,
    UtensilsCrossed
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

    const getStatusBadge = (estado) => {
        const statuses = {
            'Pendiente': { color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: Clock },
            'Preparando': { color: 'bg-blue-50 text-blue-700 ring-blue-600/20', icon: Loader2 },
            'Servido': { color: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', icon: Package },
            'Pagado': { color: 'bg-green-50 text-green-700 ring-green-600/20', icon: CheckCircle2 },
            'Cancelado': { color: 'bg-red-50 text-red-700 ring-red-600/20', icon: AlertCircle },
        };

        const config = statuses[estado] || statuses['Pendiente'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color}`}>
                <Icon className={`mr-1 h-3 w-3 ${estado === 'Preparando' ? 'animate-spin' : ''}`} />
                {estado}
            </span>
        );
    };

    const getPaymentStatusBadge = (payment) => {
        if (!payment) return (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Sin Pago
            </span>
        );

        const statuses = {
            'PENDING': { label: 'Pago Pendiente', color: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
            'CONFIRMED': { label: 'Pago Confirmado', color: 'bg-green-50 text-green-700 ring-green-600/20' },
            'REJECTED': { label: 'Pago Rechazado', color: 'bg-red-50 text-red-700 ring-red-600/10' },
        };

        const config = statuses[payment.status] || statuses['PENDING'];

        return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color}`}>
                {config.label}
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
                    <table className="w-full caption-bottom text-sm text-gray-600 dark:text-gray-400">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Fecha</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Estado Pedido</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Pago</th>
                                <th className="h-12 px-4 text-right align-middle font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {orders.length > 0 ? (
                                orders.map((o) => (
                                    <tr key={o.id} className="border-b transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                                        <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                            #{o.id}
                                        </td>
                                        <td className="p-4 align-middle hidden sm:table-cell">
                                            {new Date(o.fechaHora).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle truncate max-w-[150px]">
                                            {o.cliente?.nombre || 'Consumidor Final'}
                                        </td>
                                        <td className="p-4 align-middle font-semibold text-gray-900 dark:text-gray-100">
                                            ${o.total?.toFixed(2)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {getStatusBadge(o.estado)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {getPaymentStatusBadge(o.Payment)}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <button
                                                onClick={() => handleViewDetails(o.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                            >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center">
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
                title={selectedOrder ? `Pedido #${selectedOrder.id}` : "Cargando..."}
                maxWidth="max-w-4xl"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Infomación del Pedido */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Detalles del Pedido</h3>
                                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Fecha y Hora:</span>
                                        <span className="font-medium">{new Date(selectedOrder.fechaHora).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Cliente:</span>
                                        <span className="font-medium">{selectedOrder.cliente?.nombre || 'Consumidor Final'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Estado del Pedido:</span>
                                        {getStatusBadge(selectedOrder.estado)}
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2 border-t dark:border-gray-800">
                                        <span className="font-bold">Total:</span>
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Información del Pago */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Información de Pago</h3>
                                {selectedOrder.Payment ? (
                                    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/20 dark:bg-blue-900/10 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Estado Pago:</span>
                                            {getPaymentStatusBadge(selectedOrder.Payment)}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Método:</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.Payment.paymentMethod?.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Tipo:</span>
                                            <span className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 uppercase font-bold tracking-tighter">
                                                {selectedOrder.Payment.paymentMethod?.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t dark:border-gray-800">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Detalles del Titular</p>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-gray-500 block">Nombre:</span>
                                                    <span className="font-medium">{selectedOrder.Payment.paymentMethod?.ownerName}</span>
                                                </div>
                                                {selectedOrder.Payment.paymentMethod?.ownerId && (
                                                    <div>
                                                        <span className="text-gray-500 block">ID/RIF:</span>
                                                        <span className="font-medium">{selectedOrder.Payment.paymentMethod?.ownerId}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center py-8">
                                        <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 font-medium">No hay información de pago registrada.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="space-y-4 pt-4 border-t dark:border-gray-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <UtensilsCrossed className="h-4 w-4" />
                                Productos del Pedido
                            </h3>
                            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
                                                    <div className="font-medium text-gray-900 dark:text-white">{item.plato?.nombre}</div>
                                                    {item.nota && (
                                                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1 p-1.5 bg-amber-50/50 dark:bg-amber-900/10 rounded border border-amber-100/50 dark:border-amber-800/10">
                                                            <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                                            <span>{item.nota}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center font-medium">{item.cantidad}</td>
                                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 font-mono">${item.precioUnitario?.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white font-mono">
                                                    ${(item.cantidad * item.precioUnitario).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-6 py-2 text-sm font-bold text-white dark:text-gray-900 shadow transition-all hover:bg-gray-800 active:scale-95"
                            >
                                Cerrar Detalle
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
