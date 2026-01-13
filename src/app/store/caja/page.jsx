
'use client'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'
import {
    Banknote,
    Clock,
    CheckCircle2,
    ChevronRight,
    Loader2,
    Wallet,
    Calendar,
    TrendingUp,
    Receipt,
    Users,
    CreditCard,
    History,
    UtensilsCrossed,
    MapPin,
    Hash,
    Eye,
    ExternalLink,
    AlertCircle,
    Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'

export default function CajaPage() {
    const [pendingOrders, setPendingOrders] = useState([])
    const [stats, setStats] = useState({ totalIncome: 0, count: 0, byMethod: {} })
    const [paymentMethods, setPaymentMethods] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const [activeTab, setActiveTab] = useState('mesa') // 'mesa' or 'delivery'

    const user = useAppSelector((state) => state.auth.auth)

    useEffect(() => {
        fetchCajaData()
    }, [])

    const fetchCajaData = async () => {
        try {
            const [pendingRes, statsRes, methodsRes] = await Promise.all([
                fetch('/api/user/caja/pending'),
                fetch('/api/user/caja/stats'),
                fetch(`/api/user/business/payment-methods?restaurantId=${user.restauranteId}`)
            ])

            if (pendingRes.ok) setPendingOrders(await pendingRes.json())
            if (statsRes.ok) setStats(await statsRes.json())
            if (methodsRes.ok) {
                const methodsData = await methodsRes.json()
                setPaymentMethods(methodsData.data || [])
            }
        } catch (err) {
            console.error(err)
            toast.error('Error al cargar datos de caja')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenPayment = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const handleConfirmPayment = async (methodId) => {
        setConfirming(true)
        try {
            const res = await fetch('/api/user/caja/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: selectedOrder.id,
                    paymentMethodId: methodId,
                    monto: selectedOrder.total
                })
            })

            if (res.ok) {
                toast.success(`Pedido #${selectedOrder.id} pagado con éxito`)
                setIsModalOpen(false)
                fetchCajaData()
            } else {
                throw new Error('Error al procesar el pago')
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setConfirming(false)
        }
    }

    const filteredOrders = pendingOrders.filter(o => {
        if (activeTab === 'mesa') return o.mesaId !== null;
        return o.mesaId === null;
    });

    const groupedOrders = activeTab === 'mesa'
        ? Object.values(filteredOrders.reduce((acc, order) => {
            const mId = order.mesaId;
            if (!acc[mId]) {
                acc[mId] = {
                    mesa: order.mesa,
                    orders: []
                };
            }
            acc[mId].orders.push(order);
            return acc;
        }, {}))
        : filteredOrders;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                <p className="text-gray-500 font-medium tracking-tight">Preparando terminal de caja...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header & Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <Banknote className="h-8 w-8 text-green-600" />
                        Terminal de Cobros
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Procesa los pagos de mesas y domicilios de forma eficiente.
                    </p>
                </div>

                <Card className="p-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/20 border-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-20 w-20" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-1">Ingresos de Hoy</p>
                        <h2 className="text-4xl font-black tracking-tighter">${stats.totalIncome.toFixed(2)}</h2>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                <span className="text-[10px] font-black">{stats.count} COBROS</span>
                            </div>
                            <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                <span className="text-[10px] font-black flex items-center gap-1 uppercase">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs Selection */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit shadow-inner">
                <button
                    onClick={() => setActiveTab('mesa')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'mesa' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <UtensilsCrossed className="h-4 w-4" />
                    CUENTAS EN MESA
                </button>
                <button
                    onClick={() => setActiveTab('delivery')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'delivery' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MapPin className="h-4 w-4" />
                    DOMICILIOS
                </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Unpaid Orders List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            Pendientes de Pago ({filteredOrders.length})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {groupedOrders.length === 0 ? (
                            <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <div className="h-16 w-16 bg-white dark:bg-gray-950 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-gray-800">
                                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
                                </div>
                                <p className="text-gray-500 font-bold uppercase tracking-tight">Todo al día</p>
                                <p className="text-xs text-gray-400 mt-1">No hay cuentas pendientes en esta sección.</p>
                            </div>
                        ) : (
                            groupedOrders.map((group) => {
                                const orders = activeTab === 'mesa' ? group.orders : [group];
                                const table = activeTab === 'mesa' ? group.mesa : null;

                                return (
                                    <div key={activeTab === 'mesa' ? `table-${table.id}` : `order-${group.id}`} className={activeTab === 'mesa' ? "space-y-3 mb-6 bg-gray-50/30 dark:bg-gray-900/5 p-3 rounded-[2rem] border border-gray-100 dark:border-gray-800" : ""}>
                                        {activeTab === 'mesa' && (
                                            <div className="flex items-center gap-3 px-3 mb-1">
                                                <div className="h-10 w-10 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-black text-xl shadow-lg">
                                                    {table.numero}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Mesa {table.numero}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {orders.length} {orders.length === 1 ? 'Cuenta registrada' : 'Cuentas registradas'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {orders.map((order) => (
                                            <Card key={order.id} className="p-4 hover:shadow-xl transition-all border-gray-100 dark:border-gray-800 overflow-hidden relative group">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'mesa' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-5">
                                                        {activeTab === 'delivery' && (
                                                            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-blue-600">
                                                                <MapPin className="h-7 w-7" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm">Orden #{order.id}</h4>
                                                                <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-black uppercase">
                                                                    {order.estado}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <p className="text-[11px] text-gray-500 flex items-center gap-1 font-bold">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(order.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                                <span className="text-gray-300">|</span>
                                                                <p className="text-[11px] text-gray-500 flex items-center gap-1 font-bold uppercase truncate max-w-[150px]">
                                                                    <Users className="h-3 w-3" />
                                                                    {order.nombreCliente || order.cliente?.nombre || 'Consumidor Final'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 pt-4 sm:pt-0">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Costo Total</p>
                                                            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                                                                ${order.total.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleOpenPayment(order)}
                                                            className={`shadow-xl scale-105 px-8 font-black uppercase text-xs h-12 ${activeTab === 'mesa' ? 'shadow-orange-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
                                                        >
                                                            Cobrar
                                                            <ChevronRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Breakdown Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 border-none shadow-xl shadow-gray-200 dark:shadow-none bg-white dark:bg-gray-950">
                        <h4 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-500">
                            <Wallet className="h-4 w-4 text-green-500" />
                            Ingresos por Métodos
                        </h4>
                        <div className="space-y-4">
                            {Object.entries(stats.byMethod).length > 0 ? (
                                Object.entries(stats.byMethod).map(([method, amount]) => (
                                    <div key={method} className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-hover hover:border-green-200">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{method.replace('_', ' ')}</span>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${amount.toFixed(2)}</span>
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-30">
                                    <Receipt className="h-10 w-10 mx-auto mb-2" />
                                    <p className="text-[10px] font-black uppercase">Sin ventas hoy</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 bg-transparent text-center group cursor-pointer hover:border-orange-200 transition-colors">
                        <div className="h-12 w-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <History className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
                        </div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Reporte de Cierre</h4>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold leading-relaxed px-4">Genera un resumen detallado de todas las operaciones del turno.</p>
                        <button className="mt-6 text-xs font-black text-orange-600 hover:text-orange-700 uppercase tracking-tighter flex items-center gap-2 mx-auto decoration-2 underline-offset-4 hover:underline">
                            DESCARGAR PDF
                        </button>
                    </Card>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            {isModalOpen && selectedOrder && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={activeTab === 'mesa' ? `Confirmar Pago - Mesa ${selectedOrder.mesa?.numero}` : `Confirmar Pago - Domicilio #${selectedOrder.id}`}
                    maxWidth="max-w-2xl"
                >
                    <div className="space-y-8">
                        <div className="bg-gray-900 text-white p-8 rounded-[2rem] text-center shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                            <div className="absolute -top-10 -left-10 h-32 w-32 bg-white/5 rounded-full"></div>
                            <div className="relative z-10">
                                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total a Recaudar</p>
                                <h3 className="text-5xl font-black tracking-tighter">
                                    ${parseFloat(selectedOrder.total).toFixed(2)}
                                </h3>
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                    <Hash className="h-3 w-3" /> Orden #{selectedOrder.id}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {selectedOrder.Payment ? 'Verificación de Pago' : 'Selección de Medio'}
                                </label>
                                <span className="text-[9px] font-bold text-green-500">SEGURO</span>
                            </div>

                            {selectedOrder.Payment && (
                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Cargado por Cliente</p>
                                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-tighter">
                                                {selectedOrder.Payment.paymentMethod?.label || 'Método no especificado'}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">
                                                {selectedOrder.Payment.paymentMethod?.type?.replace('_', ' ') || 'S/N'}
                                            </p>
                                        </div>
                                        <div className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded text-[10px] font-black text-amber-700 uppercase">
                                            {selectedOrder.Payment.status}
                                        </div>
                                    </div>

                                    {(selectedOrder.Payment.paymentMethod?.type === 'PAGO_MOVIL' || selectedOrder.Payment.paymentMethod?.type === 'TRANSFERENCIA') && (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 pt-2 border-t border-amber-200 dark:border-amber-800/50">
                                                <ImageIcon className="h-3 w-3" /> Comprobante Adjunto
                                            </p>
                                            {selectedOrder.Payment.receiptUrl ? (
                                                <div className="relative group rounded-xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg bg-white">
                                                    <img
                                                        src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${selectedOrder.Payment.receiptUrl}`}
                                                        alt="Comprobante de pago"
                                                        className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <a
                                                        href={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${selectedOrder.Payment.receiptUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        Ver Ampliado
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center bg-gray-100 dark:bg-black/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Sin imagen adjunta</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => handleConfirmPayment(selectedOrder.Payment.paymentMethodId)}
                                        disabled={confirming}
                                        className="w-full bg-green-600 hover:bg-green-700 h-12 font-black uppercase text-xs shadow-xl shadow-green-500/20"
                                    >
                                        {confirming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                        Conformar y Finalizar
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                                            <span className="bg-amber-50 dark:bg-gray-900 px-4 text-gray-400">O cambiar método a</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-3">
                                {paymentMethods.length > 0 ? (
                                    paymentMethods
                                        .filter(m => !selectedOrder.Payment || m.id !== selectedOrder.Payment.paymentMethodId)
                                        .map((method) => (
                                            <button
                                                key={method.id}
                                                disabled={confirming}
                                                onClick={() => handleConfirmPayment(method.id)}
                                                className="group flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all active:scale-[0.97] disabled:opacity-50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 transition-all">
                                                        <CreditCard className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-extrabold text-gray-900 dark:text-white uppercase text-xs tracking-tighter mb-0.5">{method.label}</p>
                                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{method.type.replace('_', ' ')}</p>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-8 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:border-green-200 group-hover:bg-green-50 transition-all">
                                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-500" />
                                                </div>
                                            </button>
                                        ))
                                ) : (
                                    <div className="text-center py-10 bg-red-50/30 rounded-2xl border-2 border-dashed border-red-100">
                                        <AlertCircle className="h-8 w-8 text-red-300 mx-auto mb-2" />
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-tight">Sin métodos de pago</p>
                                        <p className="text-[10px] text-red-400 mt-1">Configura métodos de pago en el dashboard.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full px-6 py-4 text-xs font-black text-gray-400 bg-transparent rounded-2xl border-2 border-transparent hover:text-gray-600 uppercase tracking-widest transition-colors"
                            >
                                Abandonar Operación
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
