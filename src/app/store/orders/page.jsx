'use client'

import Link from 'next/link';
import ButtomDelete from '@/components/buttomdelete';
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from 'react';

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
        const res = await fetch(`/api/user/orders/user/${id}`)
        const { orders } = await res.json()
        setOrders(orders);
        setLoading(false);
    }

    const handleRowClick = async (orderId) => {
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

    if (loading) {
        return <div className='container mx-auto mt-20'>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-20">
            <h1 className="text-center text-2xl font-bold mb-2">List of Orders</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                total
                            </th>
                            <th scope="col" className="px-6 py-3">
                                fechaHora
                            </th>
                            <th scope="col" className="px-6 py-3">
                                status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((o) => (
                                <tr key={o.id} onClick={() => handleRowClick(o.id)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {o.estado}
                                    </th>
                                    <td className="px-6 py-4">
                                        {o.total}$
                                    </td>
                                    <td className="px-6 py-4">
                                        {o.fechaHora}
                                    </td>
                                    <td className="px-6 py-4">
                                        {o.status == true ? (<><p className='text-green-400'>Procesado</p></>) : (<><p className='text-orange-300'>En Proceso</p></>)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* <button type="button" onClick={() => {
                                            deleteProduct(p.id)
                                        }} className="bg-red-500 text-white p-2 rounded-md">Delete</button> */}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pedido #{selectedOrder.id}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(selectedOrder.fechaHora).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold tracking-wider">Estado</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white mt-1 capitalize">{selectedOrder.estado}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                                    <p className="text-xs text-green-600 dark:text-green-400 uppercase font-semibold tracking-wider">Total</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">${selectedOrder.total}</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                                    <p className="text-xs text-purple-600 dark:text-purple-400 uppercase font-semibold tracking-wider">Cliente</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white mt-1 truncate">
                                        {selectedOrder.cliente ? selectedOrder.cliente.nombre : 'Sin Cliente'}
                                    </p>
                                    {selectedOrder.cliente?.telefono && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedOrder.cliente.telefono}</p>
                                    )}
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Producto</th>
                                                <th className="px-6 py-4 text-center">Cant.</th>
                                                <th className="px-6 py-4 text-right">Precio Unit.</th>
                                                <th className="px-6 py-4 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {selectedOrder.items?.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900 dark:text-white">{item.plato?.nombre || "Producto desconocido"}</div>
                                                        {item.nota && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                                                {item.nota}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-800/50 font-mono">
                                                        {item.cantidad}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300 font-mono">
                                                        ${item.precioUnitario}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white font-mono">
                                                        ${(item.cantidad * item.precioUnitario).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-700 dark:text-gray-200">Total Final</td>
                                                <td className="px-6 py-4 text-right font-bold text-xl text-blue-600 dark:text-blue-400 font-mono">
                                                    ${selectedOrder.total}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all shadow-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}