'use client'

import Link from 'next/link';
import ButtomDelete from '@/components/buttomdelete';
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from 'react';

export default function Orders() {

    const id = useAppSelector((state) => state.auth.auth.id)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async () => {
        const res = await fetch(`/api/orders/user/${id}`)
        const { orders } = await res.json()
        setOrders(orders);
        setLoading(false);
    }

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
                                Order
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total 
                            </th>
                            <th scope="col" className="px-6 py-3">
                                CLient
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
                                <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {o.order.map((order,index)=>(
                                          <><p key={order.name}>{order.name} - {order.price}$ - cantidad: {order.count}</p></>
                                        ))}
                                    </th>
                                    <td className="px-6 py-4">
                                        {o.priceFull}$
                                    </td>
                                    <td className="px-6 py-4">
                                        {o.userId}
                                    </td>
                                    <td className="px-6 py-4">
                                        { o.status == true ? (<><p className='text-green-400'>Procesado</p></>) : (<><p className='text-orange-300'>En Proceso</p></>) }
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
        </div>
    )
}