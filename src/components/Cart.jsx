'use client'

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useEffect, useState } from "react";
import AddCart from "./addCart";
import DeleteCart from "./deleteCart";
import { inialityCount, order } from "@/lib/features/cart/orderSlice";

export default function Cart({ products }) {

    const dispatch = useAppDispatch()
    useEffect(() => {
        // This code will only run on the client side
        if (typeof window !== 'undefined') {
            const store = JSON.parse(localStorage.getItem('order'));
            let count = 0
            if (store) {
                store.forEach(e => {
                    count = count + e.count
                });
                dispatch(order(store));
                dispatch(inialityCount(count))
            }
        }
    }, []);

    const ProductOrder = useAppSelector((state) => state.order.order)
    const [productos, setProductos] = useState(products)

    return (
        <>
            {
                productos.map((p) => (
                    <div key={p.id} className="w-full max-w-sm bg-card text-card-foreground border rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700 m-2">
                        <img className="rounded-t-lg object-cover w-full h-48" src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`} alt={p.nombre} />
                        <div className="p-5 flex flex-col justify-between">
                            <div>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">{p.nombre}</h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm overflow-hidden text-ellipsis line-clamp-2">{p.descripcion}</p>
                                <p className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{parseFloat(p.precio).toFixed(2)} $</p>
                            </div>
                            <div className="mt-4">
                                {
                                    ProductOrder.find(o => o.id === p.id) ? (
                                        <DeleteCart id={p.id} />
                                    ) : (
                                        <AddCart id={p.id} car={p.car} name={p.nombre} price={parseFloat(p.precio).toFixed(2)} contornos={p.contornos} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
