'use client'
import ButtomEdit from '@/components/buttomEdit';
import Link from 'next/link';
import ButtomDelete from '@/components/buttomdelete';
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from 'react';

export default function ListProduct() {

    const id = useAppSelector((state) => state.auth.auth.id)
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        productt();
    }, [])

    const productt = async () => {
        const res = await fetch(`/api/product/user/${id}`)
        const { product } = await res.json()
        setProduct(product);
        setLoading(false);
    }

    async function deleteProduct(id) {
        const res = await fetch(`/api/product/${id}`, {
            method: 'DELETE'
        })

        const eliminado = await res.json()
        if (eliminado.status) {
            setLoading(true)
            productt()
        } else {
            alert(eliminado.message)
        }
    }

    if (loading) {
        return <div className='container mx-auto mt-20'>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-20">
            <h1 className="text-center text-2xl font-bold mb-2">List of Product</h1>
            <div>
                <Link href={'/store/product/new'} className="bg-blue-500 text-white p-2 rounded-md">New Product</Link>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.map((p) => (
                                <tr key={p.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {p.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {p.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <ButtomEdit path='/store/product/' id={p.id} />

                                        <button type="button" onClick={() => {
                                            deleteProduct(p.id)
                                        }} className="bg-red-500 text-white p-2 rounded-md">Delete</button>
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