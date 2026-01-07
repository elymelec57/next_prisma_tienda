'use client'

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useEffect, useState, Fragment } from "react";
import AddCart from "./addCart";
import DeleteCart from "./deleteCart";
import { inialityCount, order } from "@/lib/features/cart/orderSlice";

export default function Cart({ products }) {

    const dispatch = useAppDispatch()
    useEffect(() => {
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
    }, [dispatch]);

    const ProductOrder = useAppSelector((state) => state.order.order)
    const [productos, setProductos] = useState(products)

    return (
        <Fragment>
            {productos.map((p) => (
                <div key={p.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">

                    {/* Imagen del Producto */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        {p.mainImage?.url ? (
                            <img
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`}
                                alt={p.nombre}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 bg-slate-50">
                                <span className="text-xs font-medium">Sin imagen</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                            {parseFloat(p.precio).toFixed(2)} $
                        </div>
                    </div>

                    {/* Contenido de la Card */}
                    <div className="flex flex-1 flex-col p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900 line-clamp-1 mb-2 group-hover:text-orange-600 transition-colors">
                                {p.nombre}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-[2.5rem]">
                                {p.descripcion || "Sin descripción disponible."}
                            </p>
                        </div>

                        {/* Footer con los botones */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            {ProductOrder.find(o => o.id === p.id) ? (
                                <DeleteCart id={p.id} />
                            ) : (
                                <AddCart id={p.id} car={p.car} name={p.nombre} price={parseFloat(p.precio).toFixed(2)} contornos={p.contornos} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </Fragment>
    )
}
