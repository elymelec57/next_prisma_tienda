'use client'

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useEffect, Fragment } from "react";
import AddCart from "./addCart";
import DeleteCart from "./deleteCart";
import { inialityCount, order } from "@/lib/features/cart/orderSlice";
import { formatCurrency } from "@/lib/utils/currency";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function Cart({ products, currency, restaurantId, categoryId }) {

    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const sucursalId = searchParams.get('sucursal');
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

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['products-store', restaurantId, categoryId, sucursalId],
        queryFn: async ({ pageParam = 0 }) => {
            const url = `/api/products-store?id=${restaurantId}&skip=${pageParam}&take=6${categoryId ? `&categoryId=${categoryId}` : ''}${sucursalId ? `&sucursalId=${sucursalId}` : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 6) return undefined;
            return allPages.length * 6;
        },
        initialData: { pages: [products], pageParams: [0] },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const items = data ? data.pages.flat() : [];

    return (
        <Fragment>
            {items.map((p) => (
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
                            {formatCurrency(parseFloat(p.precio), currency)}
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
            
            {hasNextPage && (
                <div className="col-span-full flex justify-center mt-12 mb-8">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-orange-600 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-200/50"
                    >
                        {isFetchingNextPage ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Ver Más Productos</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        )}
                    </button>
                </div>
            )}
        </Fragment>
    )
}
