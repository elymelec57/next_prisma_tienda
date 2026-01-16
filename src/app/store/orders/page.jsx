
'use client'

import { useEffect, useState, useMemo } from 'react';
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
    UtensilsCrossed,
    MapPin,
    Hash,
    Layers
} from 'lucide-react';
import Modal from '@/components/Modal';

export default function Orders() {

    const user = useAppSelector((state) => state.auth.auth)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('mesa'); // 'mesa' or 'delivery'

    useEffect(() => {
        if (user.restauranteId) {
            getOrders();
        }
    }, [user.restauranteId])

    const getOrders = async () => {
        try {
            const res = await fetch(`/api/user/orders/user/${user.restauranteId}`)
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

    const handleViewDetails = async (order) => {
        try {
            let idsToFetch = [order.id];

            // Si es mesa y tiene sub-ordenes (cuentas separadas), obtenemos los IDs de todas
            if (activeTab === 'mesa' && order.subOrders && order.subOrders.length > 0) {
                idsToFetch = order.subOrders.map(so => so.id);
            }

            const promises = idsToFetch.map(id => fetch(`/api/user/orders/${id}`).then(res => res.json()));
            const data = await Promise.all(promises);

            setSelectedOrders(data);
            setIsModalOpen(true);
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

    const filteredOrders = useMemo(() => {
        const filtered = orders.filter(o => {
            if (activeTab === 'mesa') return o.mesaId !== null;
            return o.mesaId === null;
        });

        if (activeTab === 'mesa') {
            const groups = {};
            filtered.forEach(o => {
                const key = o.mesaId;
                if (!groups[key]) {
                    groups[key] = {
                        ...o,
                        subOrders: [o],
                        total: Number(o.total || 0),
                        // Preservamos la fecha más antigua para mostrar cuánto tiempo llevan
                        fechaHora: o.fechaHora
                    };
                } else {
                    groups[key].subOrders.push(o);
                    groups[key].total += Number(o.total || 0);
                    // Si encontramos una orden mas vieja en la misma mesa, actualizamos la fecha del grupo
                    if (new Date(o.fechaHora) < new Date(groups[key].fechaHora)) {
                        groups[key].fechaHora = o.fechaHora;
                    }
                }
            });
            // Marcamos las que tienen cuentas separadas
            return Object.values(groups).map(g => {
                if (g.subOrders.length > 1) {
                    return {
                        ...g,
                        nombreCliente: `Múltiples Cuentas (${g.subOrders.length})`
                    };
                }
                return g;
            });
        }

        return filtered;
    }, [orders, activeTab]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Gestión de Pedidos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Monitorea y gestiona los pedidos realizados en tu restaurante.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('mesa')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mesa' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <UtensilsCrossed className="h-4 w-4" />
                    En Mesa
                </button>
                <button
                    onClick={() => setActiveTab('delivery')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'delivery' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MapPin className="h-4 w-4" />
                    Domicilio
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr className="border-b transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-bold">ID</th>
                                {activeTab === 'mesa' && <th className="h-12 px-4 text-left align-middle font-bold">Mesa</th>}
                                <th className="h-12 px-4 text-left align-middle font-bold hidden sm:table-cell">Tiempo</th>
                                <th className="h-12 px-4 text-left align-middle font-bold">Cliente</th>
                                <th className="h-12 px-4 text-left align-middle font-bold">Total</th>
                                <th className="h-12 px-4 text-left align-middle font-bold">Estado</th>
                                <th className="h-12 px-4 text-left align-middle font-bold text-transparent">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((o) => {
                                    const minutesAgo = Math.floor((new Date() - new Date(o.fechaHora)) / 60000);
                                    const isLate = minutesAgo > 20 && o.estado !== 'Pagado' && o.estado !== 'Servido';

                                    return (
                                        <tr key={o.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                                            <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100 uppercase text-xs">
                                                #{o.id}
                                            </td>
                                            {activeTab === 'mesa' && (
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 text-sm font-black ring-2 ring-orange-50 dark:ring-orange-900">
                                                            {o.mesa?.numero}
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Mesa</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="p-4 align-middle hidden sm:table-cell">
                                                <div className={`flex items-center gap-1.5 font-bold text-xs ${isLate ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {minutesAgo} min
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle truncate max-w-[150px] font-medium text-xs">
                                                {o.nombreCliente || o.cliente?.nombre || 'Consumidor Final'}
                                            </td>
                                            <td className="p-4 align-middle font-black text-gray-900 dark:text-gray-100">
                                                ${o.total?.toFixed(2)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(o.estado)}
                                            </td>
                                            {/* <td className="p-4 align-middle">
                                                {getPaymentStatusBadge(o.Payment)}
                                            </td> */}
                                            <td className="p-4 align-middle text-right">
                                                <button
                                                    onClick={() => handleViewDetails(o)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={activeTab === 'mesa' ? 8 : 7} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Package className="h-10 w-10 opacity-20" />
                                            <p className="font-medium">No se encontraron pedidos en {activeTab === 'mesa' ? 'mesas' : 'domicilio'}.</p>
                                        </div>
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
                title={selectedOrders.length > 1 ? `Detalle de Mesa ${selectedOrders[0]?.mesa?.numero} (${selectedOrders.length} Cuentas)` : (selectedOrders[0] ? `Detalle de Orden #${selectedOrders[0].id}` : "Cargando...")}
                maxWidth="max-w-6xl"
            >
                {selectedOrders.length > 0 && (
                    <div className="space-y-8">
                        {selectedOrders.map((order, index) => (
                            <div key={order.id} className={index > 0 ? "pt-8 border-t-2 border-dashed border-gray-200 dark:border-gray-800" : ""}>
                                {selectedOrders.length > 1 && (
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                                {index + 1}
                                            </span>
                                            Cuenta #{order.id}
                                            <span className="text-sm font-normal text-gray-500">
                                                - {order.nombreCliente || order.cliente?.nombre || 'Consumidor Final'}
                                            </span>
                                        </h2>
                                        {getStatusBadge(order.estado)}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {['Caja', 'Administrador', 'admin'].includes(user.role) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Infomación del Pedido */}
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">General</h3>
                                                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/50 space-y-4">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-medium flex items-center gap-2"><Calendar className="h-4 w-4" /> Fecha:</span>
                                                        <span className="font-bold">{new Date(order.fechaHora).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-medium flex items-center gap-2"><User className="h-4 w-4" /> Cliente:</span>
                                                        <span className="font-bold">{order.nombreCliente || order.cliente?.nombre || 'Consumidor Final'}</span>
                                                    </div>
                                                    {order.mesa && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500 font-medium flex items-center gap-2"><Hash className="h-4 w-4" /> Ubicación:</span>
                                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-black text-xs uppercase underline underline-offset-4 decoration-2">
                                                                Mesa {order.mesa.numero}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!order.mesa && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500 font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Tipo:</span>
                                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black text-xs uppercase underline underline-offset-4 decoration-2">
                                                                Domicilio
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedOrders.length === 1 && (
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500 font-medium flex items-center gap-2"><Layers className="h-4 w-4" /> Estado:</span>
                                                            {getStatusBadge(order.estado)}
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center text-sm pt-4 border-t dark:border-gray-800">
                                                        <span className="font-bold text-gray-500">Total a Pagar:</span>
                                                        <span className="text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tighter">${order.total?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Información del Pago */}
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Transacción</h3>
                                                {order.Payment ? (
                                                    <div className="rounded-2xl border border-green-100 bg-green-50/30 p-5 dark:border-green-900/20 dark:bg-green-900/10 space-y-4">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500 font-medium">Estado Pago:</span>
                                                            {getPaymentStatusBadge(order.Payment)}
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500 font-medium">Método de Pago:</span>
                                                            <div className="text-right">
                                                                <span className="font-black text-gray-900 dark:text-white block">{order.Payment.paymentMethod?.label}</span>
                                                                <span className="text-[10px] px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 uppercase font-black tracking-widest mt-1 inline-block">
                                                                    {order.Payment.paymentMethod?.type.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 border-t dark:border-gray-800">
                                                            <p className="text-[10px] text-gray-400 uppercase font-black mb-3 flex items-center gap-2">
                                                                <CheckCircle2 className="h-3 w-3" /> Datos de Verificación
                                                            </p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-white dark:border-white/5">
                                                                    <span className="text-xs text-gray-400 block font-bold">TITULAR</span>
                                                                    <span className="font-bold text-sm">{order.Payment.paymentMethod?.ownerName}</span>
                                                                </div>
                                                                {order.Payment.paymentMethod?.ownerId && (
                                                                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-white dark:border-white/5">
                                                                        <span className="text-xs text-gray-400 block font-bold">CÉDULA / ID</span>
                                                                        <span className="font-bold text-sm">{order.Payment.paymentMethod?.ownerId}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 p-8 text-center flex flex-col items-center justify-center h-[calc(100%-1.75rem)] min-h-[220px]">
                                                        <div className="h-16 w-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                                                            <AlertCircle className="h-8 w-8 text-gray-200" />
                                                        </div>
                                                        <p className="text-sm text-gray-400 font-bold max-w-[180px]">El pago aún no ha sido procesado por caja.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Items Table */}
                                    <div className="space-y-4 pt-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                            <UtensilsCrossed className="h-4 w-4" />
                                            Comanda Detallada
                                        </h3>
                                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-400 dark:text-gray-500 uppercase font-black border-b border-gray-200 dark:border-gray-800 tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Ítem / Especificación</th>
                                                        <th className="px-6 py-4 text-center">Cant.</th>
                                                        <th className="px-6 py-4 text-right">Unitario</th>
                                                        <th className="px-6 py-4 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                    {order.items?.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-black text-gray-900 dark:text-white uppercase text-xs">{item.plato?.nombre}</div>
                                                                {item.nota && (
                                                                    <div className="text-xs text-orange-500 dark:text-orange-400 mt-2 flex items-start gap-1 p-2 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                                                        <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                                                        <span className="font-medium italic leading-relaxed text-gray-600 dark:text-gray-400">"{item.nota}"</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-center h-full">
                                                                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-black text-xs">
                                                                    {item.cantidad}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-gray-400 font-mono text-xs">${item.precioUnitario?.toFixed(2)}</td>
                                                            <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white font-mono">
                                                                ${(item.cantidad * item.precioUnitario).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-6 border-t dark:border-gray-800">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-orange-600 px-10 text-sm font-black text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-700 active:scale-95"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
