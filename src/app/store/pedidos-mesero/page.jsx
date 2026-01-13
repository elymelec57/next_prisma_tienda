
'use client'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
    setCurrentTable,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    clearActiveAccount,
    addAccountToTable,
    removeAccountFromTable,
    setActiveAccount,
    updateAccountName
} from '@/lib/features/waiter/waiterSlice'
import TableSelector from './components/TableSelector'
import MenuSelector from './components/MenuSelector'
import OrderSummary from './components/OrderSummary'
import { ChevronLeft, ClipboardList, ShoppingBag, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function PedidosMesero() {
    const dispatch = useAppDispatch()
    const { currentTable, ordersByTable } = useAppSelector((state) => state.waiter)
    const user = useAppSelector((state) => state.auth.auth)
    const [sending, setSending] = useState(false)

    const tableData = currentTable ? ordersByTable[currentTable.id] : null
    const currentAccountIndex = tableData?.activeAccount ?? 0
    const accounts = tableData?.accounts || []
    const currentAccount = accounts[currentAccountIndex]
    const currentOrder = currentAccount?.items || []

    const handleSelectTable = (table) => {
        dispatch(setCurrentTable(table))
    }

    const handleAddItem = (product) => {
        dispatch(addItemToOrder({
            tableId: currentTable.id,
            item: {
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                image: product.mainImage?.url,
                selectedContornos: []
            }
        }))
        toast.success(`${product.nombre} añadido a ${currentAccount.name}`, {
            position: "bottom-right",
            autoClose: 1000
        })
    }

    const handleUpdateQuantity = (itemId, amount) => {
        dispatch(updateItemQuantity({ tableId: currentTable.id, itemId, amount }))
    }

    const handleRemoveItem = (itemId) => {
        dispatch(removeItemFromOrder({ tableId: currentTable.id, itemId }))
    }

    const handleRenameAccount = (index, name) => {
        dispatch(updateAccountName({ tableId: currentTable.id, accountIndex: index, name }))
    }

    const handleSendOrder = async () => {
        if (currentOrder.length === 0) return

        setSending(true)
        try {
            const orderBody = {
                restaurantId: user.restauranteId || 1,
                clienteId: null,
                nombreCliente: currentAccount.name,
                total: currentOrder.reduce((sum, item) => sum + (item.precio * item.quantity), 0),
                estado: 'Pendiente',
                mesaId: currentTable.id,
                items: currentOrder.map(item => ({
                    platoId: item.id,
                    cantidad: item.quantity,
                    precioUnitario: item.precio,
                    nota: ""
                }))
            }

            const res = await fetch('/api/user/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderBody)
            })

            if (res.ok) {
                toast.success(`Cuenta "${currentAccount.name}" enviada a cocina`)
                dispatch(clearActiveAccount(currentTable.id))
            } else {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Error al enviar el pedido')
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <ClipboardList className="h-7 w-7 md:h-8 md:w-8 text-orange-600" />
                        Toma de Pedidos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-xs md:text-sm font-medium">
                        {currentTable ? `Mesa en proceso: Nº ${currentTable.numero}` : 'Seleccione una mesa para comenzar el servicio'}
                    </p>
                </div>

                <Link
                    href="/store/orders"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-all rounded-2xl font-black text-xs uppercase tracking-widest border border-transparent hover:border-orange-100"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Seguimiento de Órdenes
                </Link>
            </div>

            <div className="flex-1 overflow-hidden">
                {!currentTable ? (
                    <TableSelector onSelectTable={handleSelectTable} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        {/* Menu Section - Expanded to 8 columns */}
                        <div className="lg:col-span-8 space-y-4 flex flex-col h-[calc(100vh-14rem)]">
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    onClick={() => dispatch(setCurrentTable(null))}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-all group"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-950 transition-colors">
                                        <ChevronLeft className="h-3 w-3" />
                                    </div>
                                    Volver al Mapa de Mesas
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
                                <MenuSelector
                                    onAddItem={handleAddItem}
                                    userId={user.id}
                                />
                            </div>
                        </div>

                        {/* Sticky Order Summary - 4 columns */}
                        <div className="lg:col-span-4 h-[calc(100vh-14rem)]">
                            <div className="bg-white dark:bg-gray-950 rounded-[2rem] border border-gray-100 dark:border-gray-800 h-full overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none translate-y-0 hover:-translate-y-1 transition-transform">
                                <OrderSummary
                                    order={currentOrder}
                                    table={currentTable}
                                    accounts={accounts}
                                    activeAccountIndex={currentAccountIndex}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                    onSendOrder={handleSendOrder}
                                    onChangeTable={() => dispatch(setCurrentTable(null))}
                                    onSelectAccount={(index) => dispatch(setActiveAccount({ tableId: currentTable.id, accountIndex: index }))}
                                    onAddAccount={() => dispatch(addAccountToTable(currentTable.id))}
                                    onRemoveAccount={(index) => dispatch(removeAccountFromTable({ tableId: currentTable.id, accountIndex: index }))}
                                    onRenameAccount={handleRenameAccount}
                                    sending={sending}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
