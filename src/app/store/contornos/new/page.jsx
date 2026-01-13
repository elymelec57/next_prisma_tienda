'use client'

import ContornoForm from "@/components/ContornoForm"
import { useRouter, useParams } from "next/navigation";
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewContornoPage() {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <div className="mb-6">
                <Link href="/store/contornos" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <MoveLeft className="mr-2 h-4 w-4" />
                    Volver al listado
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{params.id ? 'Editar Contorno' : 'Nuevo Contorno'}</h1>
                <p className="text-gray-500">{params.id ? 'Edita los detalles del contorno.' : 'Agrega un nuevo contorno para tus platos.'}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <ContornoForm
                    contornoId={params.id}
                    onSuccess={() => router.push('/store/contornos')}
                    onCancel={() => router.push('/store/contornos')}
                />
            </div>
        </div>
    )
}
