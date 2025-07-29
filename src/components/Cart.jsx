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

    const ProductOrder = useAppSelector((state)=> state.order.order)
    const [productos, setProductos] = useState(products)

    return (
        <>
            {
                productos.map((p) => (
                    <div key={p.id} className="max-w-sm bg-white border m-1 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <img className="rounded-t-lg" src={`/images/${p.image}`} alt="" />
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{p.name}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{p.description}</p>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{parseFloat(p.price).toFixed(2)}</p>
                            {
                                ProductOrder.find(o => o.id === p.id) ? (
                                    <>
                                        <DeleteCart id={p.id} />
                                    </>
                                ) : (
                                    <>
                                        <AddCart id={p.id} car={p.car} name={p.name} price={parseFloat(p.price).toFixed(2)} />
                                    </>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </>
    )
}
