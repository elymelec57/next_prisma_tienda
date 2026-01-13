
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
    X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function OrderSummary({
    order,
    table,
    accounts,
    activeAccountIndex,
    onUpdateQuantity,
    onRemoveItem,
    onSendOrder,
    onChangeTable,
    onSelectAccount,
    onAddAccount,
    onRemoveAccount,
    onRenameAccount,
    sending
}) {
    const total = order.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

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

                {/* Edit Account Name */}
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
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {order.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 py-20">
                        <ShoppingBag className="h-12 w-12 mb-2" />
                        <p className="font-medium text-sm">Esta cuenta está vacía</p>
                        <p className="text-xs">Añade platos del menú</p>
                    </div>
                ) : (
                    order.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.nombre}</h4>
                                <p className="text-xs text-orange-600 font-bold">${item.precio.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                        className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                        className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
                <div className="flex justify-between items-center px-2">
                    <span className="text-gray-500 font-medium">Subtotal {accounts[activeAccountIndex]?.name}</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>

                <Button
                    onClick={onSendOrder}
                    disabled={order.length === 0 || sending}
                    className="w-full flex items-center justify-center gap-2 h-14 text-lg font-bold shadow-xl shadow-orange-500/20 disabled:shadow-none"
                >
                    {sending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Enviar esta cuenta
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
