'use client'

import Link from "next/link";
import { useState } from "react";
export default function CartBusiness({ business }) {
    const [Business, setBusiness] = useState(business)

    return (
        <>
            {
                Business.map((p) => (
                    <div key={p.id} className="max-w-sm bg-white border m-1 border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <Link href={`/${p.slug}`}>
                        <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.logo}`} alt={p.name} />
                        </Link>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{p.name}</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{p.slogan}</p>
                            <Link href={`/${p.slug}`} type="button" title="Agregar Producto" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ir
                            </Link>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
