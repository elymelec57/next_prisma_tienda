'use client'

import Link from "next/link";
import { useState } from "react";
export default function CartBusiness({ restaurant }) {
    const [Restaurant, setRestaurant] = useState(restaurant)

    return (
        <>
            {
                Restaurant.map((p) => (
                    <div key={p.id} className="w-full max-w-sm bg-card text-card-foreground border rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 mx-2 my-4">
                        {p.mainImage !== null && (
                            <Link href={`/${p.slug}`} className="block relative h-48 overflow-hidden">
                                <img
                                    src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${p.mainImage.url}`}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        )}
                        <div className="p-5 flex flex-col justify-between">
                            <div>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                                    {p.name}
                                </h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
                                    {p.slogan}
                                </p>
                            </div>
                            <Link
                                href={`/${p.slug}`}
                                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
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
