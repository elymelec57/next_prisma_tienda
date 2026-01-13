'use client'

import ProductForm from "@/components/ProductForm"
import { useRouter, useParams } from "next/navigation";
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <div className="mb-6">
                <Link href="/store/plato" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <MoveLeft className="mr-2 h-4 w-4" />
                    Volver al listado
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{params.id ? 'Editar Plato' : 'Nuevo Plato'}</h1>
                <p className="text-gray-500">{params.id ? 'Edita los detalles de tu plato.' : 'Agrega un nuevo plato a tu menú.'}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <ProductForm
                    productId={params.id}
                    onSuccess={() => router.push('/store/plato')}
                    onCancel={() => router.push('/store/plato')}
                />
            </div>
        </div>
    )
}
