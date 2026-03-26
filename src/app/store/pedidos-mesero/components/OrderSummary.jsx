
'use client'
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    Send,
    Table as TableIcon,
    Loader2,
    Layers,
    X,
    ClipboardList,
    Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function OrderSummary({
    order,
    table,
    accounts,
    activeAccountIndex,
    onUpdateQuantity,
    onRemoveItem,
    onUpdateNote,
    onSendOrder,
    onChangeTable,
    onSelectAccount,
    onAddAccount,
    onRemoveAccount,
    onRenameAccount,
    onEditExistingOrder,
    onCancelEdit,
    sending
}) {
    const total = order.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

    const existingOrdersTotal = table.pedidos?.reduce((sum, p) => sum + p.total, 0) || 0
    const grandTotal = total + existingOrdersTotal

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <TableIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mesa Seleccionada</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Mesa {table.numero}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onChangeTable}
                        className="text-xs font-bold text-orange-600 hover:underline"
                    >
                        Cambiar Mesa
                    </button>
                </div>

                {/* Accounts Tabs */}
                {table.estado === 'Libre' && table.pedidos?.length === 0 ? (
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            {accounts.map((acc, index) => (
                                <div key={acc.id} className="relative group">
                                    <button
                                        onClick={() => onSelectAccount(index)}
                                        className={`
                                        px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                                        ${activeAccountIndex === index
                                                ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'}
                                    `}
                                    >
                                        {acc.name}
                                    </button>
                                    {accounts.length > 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemoveAccount(index); }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-2 w-2" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={onAddAccount}
                                className="px-3 py-2 text-gray-400 hover:text-orange-600 transition-colors"
                                title="Dividir Cuenta"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ) : <></>}

                {/* Edit Account Name */}
                {table.estado === 'Libre' && table.pedidos?.length === 0 ? (
                    <div className="mt-4">
                        <div className="relative group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-1">Identificador de Cuenta</label>
                            <input
                                type="text"
                                value={accounts[activeAccountIndex]?.name || ''}
                                onChange={(e) => onRenameAccount(activeAccountIndex, e.target.value)}
                                placeholder="Ej. Fam. Pérez / Cliente Barra"
                                className="w-full bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                ) : <></>}
            </div>

            {/* Existing Orders Section */}
            {table.estado === 'Ocupada' && table.pedidos?.length > 0 && (
                <div className="bg-orange-50/50 dark:bg-orange-950/10 border-b border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-orange-600" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                Consumo en Mesa
                            </h4>
                        </div>
                        <span className="text-sm font-black text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-lg">
                            ${existingOrdersTotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {table.pedidos.map((pedido) => (
                            <div key={pedido.id} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-orange-100 dark:border-orange-900/30 shadow-sm transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-tight">
                                            {pedido.nombreCliente || `Orden #${pedido.id}`}
                                        </p>
                                        <p className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md inline-block mt-0.5
                                            ${pedido.estado === 'Pendiente' ? 'bg-amber-100 text-amber-600' :
                                                pedido.estado === 'Preparando' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'}
                                        `}>
                                            {pedido.estado}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEditExistingOrder(pedido)}
                                        className="h-7 px-2 text-[10px] font-black text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                        EDITAR
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {Object.values(pedido.items.reduce((acc, item) => {
                                        const id = item.plato.id;
                                        if (!acc[id]) {
                                            acc[id] = { ...item, cantidad: 0 };
                                        }
                                        acc[id].cantidad += item.cantidad;
                                        return acc;
                                    }, {})).map((item) => (
                                        <div key={item.plato.id} className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400">
                                            <span>{item.cantidad}x {item.plato.nombre}</span>
                                            <span className="font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {order.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 py-20">
                        <ShoppingBag className="h-12 w-12 mb-2" />
                        <p className="font-medium text-sm">Esta cuenta está vacía</p>
                        <p className="text-xs">Añade platos del menú</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {order.map((item) => (
                            <div key={item.id} className="group flex gap-4 p-4 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:border-orange-200 transition-all animate-in slide-in-from-right-4 duration-300">
                                {/* Item Image */}
                                <div className="h-16 w-16 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-50 dark:border-gray-800">
                                    {item.image ? (
                                        <img
                                            src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${item.image}`}
                                            alt={item.nombre}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingBag className="h-6 w-6 text-gray-200" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-black text-xs md:text-sm text-gray-900 dark:text-white uppercase tracking-tighter truncate group-hover:text-orange-600 transition-colors">
                                        {item.nombre}
                                    </h4>
                                    <p className="text-sm font-black text-orange-600 tracking-tighter mt-1">
                                        ${(item.precio * item.quantity).toFixed(2)}
                                        <span className="text-[10px] text-gray-400 font-bold ml-2 uppercase">(${item.precio.toFixed(2)} c/u)</span>
                                    </p>

                                    {/* Notes Section */}
                                    <div className="mt-3 space-y-2">
                                        {Array.from({ length: item.quantity }).map((_, idx) => (
                                            <div key={idx} className="relative flex items-center gap-2">
                                                <div className="h-5 w-5 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[9px] font-black text-orange-600">{idx + 1}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.notes?.[idx] || ''}
                                                    onChange={(e) => onUpdateNote(item.id, idx, e.target.value)}
                                                    placeholder="Nota (ej. sin cebolla)"
                                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg px-2 py-1.5 text-[10px] font-medium focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Eliminar ítem"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <div className="flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl p-1 shadow-lg">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-white/20 dark:hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-white/20 dark:hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col">
                        <span className="text-gray-500 font-medium text-xs">Total {accounts[activeAccountIndex]?.name}</span>
                        {existingOrdersTotal > 0 && (
                            <span className="text-[10px] text-orange-600 font-bold uppercase">+ Consumo previo: ${existingOrdersTotal.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                        {existingOrdersTotal > 0 && (
                            <span className="text-xs font-bold text-gray-400">Gran Total: ${grandTotal.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    {accounts[activeAccountIndex]?.activeOrderId && (
                        <Button
                            variant="outline"
                            onClick={onCancelEdit}
                            className="flex-1 max-w-[120px] h-14 font-bold border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                            {/* <X className="h-4 w-4 mr-1" /> */}
                            Cancelar
                        </Button>
                    )}
                    <Button
                        onClick={onSendOrder}
                        disabled={order.length === 0 || sending}
                        className="flex-[2] w-full flex items-center justify-center gap-2 h-14 text-lg font-bold shadow-xl shadow-orange-500/20 disabled:shadow-none bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {sending ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                {accounts[activeAccountIndex]?.activeOrderId ? 'Actualizar' : 'Enviar cuenta'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
