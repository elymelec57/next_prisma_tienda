'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contorno } from '@/app/schemas/contonoSchema';

export default function Product() {

    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            consultContorno();
        }
    }, []);

    const {
        register,     // Función para registrar los inputs
        handleSubmit, // Función que maneja el envío (solo si es válido)
        formState: { errors, isSubmitting }, // Estado del formulario (errores y envío)
        setValue
    } = useForm({
        resolver: zodResolver(contorno), // Aquí conectamos Zod
        defaultValues: {
            name: '',
            price: '',
        },
    });

    const [userId, setUserId] = useState(useAppSelector((state) => state.auth.auth.id))

    async function consultContorno() {
        const data = await fetch(`/api/contorno/${params.id}`)
        const { contorno } = await data.json()

        setValue("name", contorno.nombre)
        setValue("price", contorno.precio)
    }

    const onSubmit = async (data) => {

        if (params.id) {
            return updateContorno(data)
        }

        try {
            console.log(data)
            const res = await fetch(`/api/contornos/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form: data, user: userId })
            });

            const { status, message } = await res.json()

            if (status) {
                toast.success(message)
                router.push('/store/contornos')
            } else {
                toast.error(message)
            }
        } catch (error) {
            toast.error('Error al crear el contorno')
        }
    }

    const updatePlato = async (data) => {
        const update = await fetch(`/api/product/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: data })
        });

        const platoUpdate = await update.json()
        if (platoUpdate.status) {
            if (image.image) {
                const response = await fetch(
                    `/api/avatar/update?filename=${image.image.name}&model=plato&id=${platoUpdate.id}&mainImage=${platoUpdate.mainImage}`,
                    {
                        method: 'POST',
                        body: image.image,
                    },
                );
            }

            toast.success(platoUpdate.message);
            router.refresh()
            router.push('/store/plato')
        }
    }


    return (
        <div className="">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-1 mt-20">{params.id ? 'Editando contornos' : 'Registro de contornos'}</h1>
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                    <input type="text" id="name" name="name" {...register('name')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                    <input type="number" id="price" name="price" {...register('price')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors.price && <p className="error">{errors.price.message}</p>}
                </div>
                <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar</button>
                    <Link className="text-blue-700 hover:underline font-medium rounded-lg text-sm w-full py-2.5 text-center border border-blue-700 dark:text-blue-500 dark:border-blue-500" href={'/store/contornos'}>Atras</Link>
                </div>
            </form>
        </div>
    )
}