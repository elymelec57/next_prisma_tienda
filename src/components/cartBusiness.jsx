'use client'

import Link from "next/link";
import { useState } from "react";
export default function CartBusiness({ restaurant }) {
    const [Restaurant, setRestaurant] = useState(restaurant)

    return (
        <>
            {
                Restaurant.map((p) => (
                    <div key={p.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 mx-2 my-4">
                        <Link href={`/${p.slug}`} className="block relative h-48 overflow-hidden">
                            <img
                                src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`}
                                alt={p.name}
                                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                            />
                        </Link>
                        <div className="p-5 flex flex-col justify-between h-auto">
                            <div>
                                <h5 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white truncate">
                                    {p.name}
                                </h5>
                                <p className="mb-3 font-medium text-gray-600 dark:text-gray-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
                                    {p.slogan}
                                </p>
                            </div>
                            <Link
                                href={`/${p.slug}`}
                                className="mt-4 w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-bold rounded-lg text-sm px-5 py-2.5 text-center shadow-lg transform transition-transform duration-200 hover:scale-105"
                            >
                                Ver Negocio
                            </Link>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
