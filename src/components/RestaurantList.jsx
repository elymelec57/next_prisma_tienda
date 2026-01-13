'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RestaurantList() {
    const [dataRest, setDataRest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/restaurants');
                const data = await res.json();
                setDataRest(data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="col-span-full text-center py-10 text-slate-500">Cargando restaurantes...</div>;
    }

    if (dataRest.length === 0) {
        return <div className="col-span-full text-center py-10 text-slate-500">No se encontraron restaurantes.</div>;
    }

    return (
        <>
            {dataRest.map((res) => (
                <div key={res.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        {res.mainImage?.url ? (
                            <img
                                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${res.mainImage.url}`}
                                alt={res.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                                <span className="text-xs">Sin imagen</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-sm">
                            Nuevo
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-slate-800 leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                                {res.name}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                            {res.description || "Deliciosos platillos te esperan."}
                        </p>
                        <Link href={`/${res.slug}`} className="mt-auto w-full inline-flex items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                            Ver Menú
                        </Link>
                    </div>
                </div>
            ))}
        </>
    );
}
