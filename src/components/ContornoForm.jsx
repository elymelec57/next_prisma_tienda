'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contorno } from '@/app/schemas/contonoSchema';
import { Save, Loader2, X } from 'lucide-react';
import { getCurrencySymbol } from '@/lib/utils/currency';

export default function ContornoForm({ contornoId = null, onSuccess, onCancel }) {

    const router = useRouter()
    const queryClient = useQueryClient();
    const userId = useAppSelector((state) => state.auth.auth.id)
    const [currency, setCurrency] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(contorno),
        defaultValues: {
            name: '',
            price: ''
        },
    });

    const { data: contornoData } = useQuery({
        queryKey: ['contorno', contornoId],
        queryFn: async () => {
            const res = await fetch(`/api/user/contornos/${contornoId}`);
            if (!res.ok) throw new Error('Error al cargar datos del contorno');
            const data = await res.json();
            setCurrency(data.currency);
            return data.contorno;
        },
        enabled: !!contornoId,
    });

    useEffect(() => {
        if (contornoData) {
            setValue("name", contornoData.nombre)
            setValue("price", contornoData.precio)
        }
    }, [contornoData, setValue]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const url = contornoId ? `/api/user/contorno/${contornoId}` : `/api/user/contornos/new`;
            const method = contornoId ? 'PUT' : 'POST';
            const body = contornoId ? { form: data } : { form: data, user: userId };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Error al guardar contorno');
            return res.json();
        },
        onSuccess: (response) => {
            if (response.status) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['contornos', userId] });
                if (contornoId) {
                    queryClient.invalidateQueries({ queryKey: ['contorno', contornoId] });
                }
                if (onSuccess) onSuccess();
                if (!contornoId) reset();
            } else {
                toast.error(response.message);
            }
        },
        onError: () => {
            toast.error('Error al guardar el contorno');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    }

    const isSubmitting = mutation.isPending;

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
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Precio ({getCurrencySymbol(currency).trim()})</label>
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
