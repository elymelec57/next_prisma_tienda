'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contorno } from '@/app/schemas/contonoSchema';
import { Save, Loader2, X } from 'lucide-react';

export default function ContornoForm({ contornoId = null, onSuccess, onCancel }) {

    const router = useRouter()
    const userId = useAppSelector((state) => state.auth.auth.id)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(contorno),
        defaultValues: {
            name: '',
            price: ''
        },
    });

    useEffect(() => {
        if (contornoId) {
            consultContorno(contornoId);
        }
    }, [contornoId]);

    async function consultContorno(id) {
        try {
            const data = await fetch(`/api/user/contornos/${id}`)
            if (data.ok) {
                const { contorno } = await data.json()
                if (contorno) {
                    setValue("name", contorno.nombre)
                    setValue("price", contorno.precio)
                }
            } else {
                toast.error("Error al cargar datos del contorno");
            }
        } catch (error) {
            console.error("Error fetching contorno:", error);
            toast.error("Error al cargar datos");
        }
    }

    const onSubmit = async (data) => {
        if (contornoId) {
            return updateContorno(data)
        }
        return createContorno(data);
    }

    const createContorno = async (data) => {
        try {
            const res = await fetch(`/api/user/contornos/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form: data, user: userId })
            });

            const response = await res.json();

            if (response.status) {
                toast.success(response.message);
                router.refresh();
                if (onSuccess) onSuccess();
                reset();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Error al crear el contorno');
        }
    }

    const updateContorno = async (data) => {
        try {
            const res = await fetch(`/api/user/contorno/${contornoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form: data })
            });

            const response = await res.json();

            if (response.status) {
                toast.success(response.message);
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Error al actualizar');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Nombre</label>
                    <input
                        {...register('name')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="Ej. Papas Fritas"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="0.00"
                    />
                    {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                >
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="mr-2 h-4 w-4" /> Guardar</>}
                </button>
            </div>
        </form>
    )
}
