'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { Store, Camera, Save, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";

export default function Business() {

    const router = useRouter()
    const userId = useAppSelector((state) => state.auth.auth.id)
    useEffect(() => {
        consultProduct()
    }, [])

    const [showImg, setShowImg] = useState(true)
    const [image, setImage] = useState({
        mainImageId: null,
        url: '',
        image: ''
    })
    const [imagePreview, setImagePreview] = useState(image.image);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        id: '',
        name: '',
        slogan: '',
        phone: '',
        direcction: '',
        slug: '',
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];

        setImage({
            ...image,
            image: file,
        })

        let fileReader = new FileReader();
        if (file) {
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImagePreview(event.target.result);
            };
        }
    }

    async function consultProduct() {
        const data = await fetch(`/api/user/business/user/${userId}`)
        const rest = await data.json()

        if (rest.status) {
            setForm({
                ...form,
                id: rest.rest.id,
                name: rest.rest.name,
                slogan: rest.rest.slogan,
                phone: rest.rest.phone,
                direcction: rest.rest.direcction,
                slug: rest.rest.slug
            })

            setImage({
                ...image,
                mainImageId: rest.rest.mainImageId,
                url: rest.rest.url
            })
        }
    }

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const irPage = () => {
        router.push(`/${form.slug}`)
    }

    const businessSave = async (e) => {
        e.preventDefault()
        setIsLoading(true);

        try {
            if (!form.id) { // Corrección: verificar form.id en lugar de form
                const storeBusiness = await fetch(`/api/user/business`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form, userId, logo: image.image?.name }) // Corrección: acceder al nombre de la imagen correctamente
                });
                const rest = await storeBusiness.json()
                if (rest) {
                    if (image.image) {
                        await fetch(
                            `/api/avatar/upload?filename=${image.image.name}&model=restaurant&id=${rest.id}`,
                            {
                                method: 'POST',
                                body: image.image,
                            },
                        );
                    }
                    toast.success('Negocio creado exitosamente')
                    router.refresh()
                    consultProduct()
                }
            } else {
                const updateBusiness = await fetch(`/api/user/business/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form })
                });

                const rest = await updateBusiness.json()
                if (rest) {

                    if (image.image && image.image instanceof File) {
                        await fetch(
                            `/api/avatar/update?filename=${image.image.name}&model=restaurant&id=${rest.id}&mainImage=${rest.mainImage}`,
                            {
                                method: 'POST',
                                body: image.image,
                            },
                        );
                    }

                    toast.success('Negocio actualizado correctamente')
                    setShowImg(true)
                    router.refresh()
                    consultProduct()
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Error al guardar el negocio')
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Mi Restaurante</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Administra la información pública de tu negocio.</p>
                </div>
                {form.id && (
                    <button
                        onClick={irPage}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 shadow-sm gap-2"
                    >
                        <ExternalLink size={16} />
                        Ver Página Pública
                    </button>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
                <div className="p-6 pt-6">
                    <form onSubmit={businessSave} className="space-y-8">

                        {/* Sección de Imagen */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Logo del Restaurante
                            </label>

                            <div className="flex items-center gap-6">
                                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-100 shadow-sm shrink-0 bg-gray-50 flex items-center justify-center">
                                    {image.mainImageId != null && showImg ? (
                                        <img
                                            src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${image.url}`}
                                            className="h-full w-full object-cover"
                                            alt="Logo actual"
                                        />
                                    ) : imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            className="h-full w-full object-cover"
                                            alt="Vista previa"
                                        />
                                    ) : (
                                        <Camera className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>

                                <div className="space-y-2 flex-1">
                                    {image.mainImageId != null && showImg ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowImg(false)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-2"
                                        >
                                            <RefreshCw size={14} />
                                            Cambiar imagen existente
                                        </button>
                                    ) : (
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <input
                                                type="file"
                                                id="logo"
                                                name="logo"
                                                accept="image/*"
                                                onChange={onFileChange}
                                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                            />
                                            {image.mainImageId != null && !showImg && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowImg(true)}
                                                    className="text-xs text-gray-500 hover:text-gray-700 text-left"
                                                >
                                                    Cancelar cambio
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nombre del Negocio
                                </label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={changeImput}
                                        placeholder="Ej. Burguer King"
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Teléfono
                                </label>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={changeImput}
                                    placeholder="+58 412..."
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="slogan" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Slogan
                                </label>
                                <input
                                    type="text"
                                    id="slogan"
                                    name="slogan"
                                    value={form.slogan}
                                    onChange={changeImput}
                                    placeholder="Frase pegadiza (opcional)"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="direcction" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dirección
                                </label>
                                <textarea
                                    id="address"
                                    name="direcction"
                                    value={form.direcction}
                                    onChange={changeImput}
                                    rows={3}
                                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Link
                                href="/store"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2 text-gray-500"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-8 py-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                            >
                                {isLoading ? (
                                    <>Guardando...</>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
