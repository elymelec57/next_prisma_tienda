'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { plato } from '@/app/schemas/platoSchema';
import { Camera, Save, X, Loader2 } from 'lucide-react';

export default function ProductForm({ productId = null, onSuccess, onCancel }) {

    const router = useRouter()

    // States
    const [categories, setCategories] = useState([]);
    const [contornos, setContornos] = useState([]);
    const [selectedContornos, setSelectedContornos] = useState([]);
    const userId = useAppSelector((state) => state.auth.auth.id);

    const [image, setImage] = useState({
        mainImageId: null,
        url: '',
        image: ''
    })
    const [showImg, setShowImg] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    // Form Hook
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(plato),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            image: '',
            categoryId: ''
        },
    });

    // Effects
    useEffect(() => {
        fetchCategories();
        if (productId) {
            consultProduct(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (userId) {
            fetchContornos();
        }
    }, [userId]);

    // Data Fetching
    async function consultProduct(id) {
        try {
            const data = await fetch(`/api/user/product/${id}`)
            const { plato } = await data.json()

            if (plato) {
                setValue("name", plato.nombre)
                setValue("description", plato.descripcion)
                setValue("price", plato.precio)
                setValue("categoryId", plato.categoriaId)

                setImage({
                    ...image,
                    mainImageId: plato.mainImageId,
                    url: plato.url
                })
                if (plato.contornos) {
                    setSelectedContornos(plato.contornos.map(c => c.id.toString()));
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Error al cargar el producto");
        }
    }

    async function fetchCategories() {
        try {
            const res = await fetch('/api/category');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchContornos() {
        if (!userId) return;
        try {
            const res = await fetch(`/api/user/contornos?userId=${userId}`);
            const data = await res.json();
            setContornos(data);
        } catch (error) {
            console.error(error);
        }
    }

    // Handlers
    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            setImage({ ...image, image: file })
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                setImagePreview(event.target.result);
            };
        }
    }

    const onSubmit = async (data) => {
        if (productId) {
            return updatePlato(data)
        }
        return createPlato(data);
    }

    const createPlato = async (data) => {
        try {
            const res = await fetch(`/api/user/product/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form: { ...data, contornos: selectedContornos }, user: userId })
            });

            const plato = await res.json();

            if (plato.status) {
                if (image.image) {
                    await fetch(
                        `/api/avatar/upload?filename=${image.image.name}&model=plato&id=${plato.id}`,
                        { method: 'POST', body: image.image },
                    );
                }
                toast.success(plato.message);
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(plato.message);
            }
        } catch (error) {
            toast.error('Ocurrió un error al crear el producto');
        }
    }

    const updatePlato = async (data) => {
        try {
            const update = await fetch(`/api/user/product/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form: { ...data, contornos: selectedContornos } })
            });

            const platoUpdate = await update.json()

            if (platoUpdate.status) {
                if (image.image && image.image instanceof File) {
                    await fetch(
                        `/api/avatar/update?filename=${image.image.name}&model=plato&id=${platoUpdate.id}&mainImage=${platoUpdate.mainImage}`,
                        { method: 'POST', body: image.image },
                    );
                }

                toast.success(platoUpdate.message);
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(platoUpdate.message);
            }
        } catch (error) {
            toast.error('Error al actualizar');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">

                {/* Image Upload Section */}
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                    {image.mainImageId != null && showImg && !imagePreview ? (
                        <div className="relative group">
                            <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${image.url}`} alt="Product" className="h-40 w-40 object-cover rounded-md shadow-sm" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                <button type="button" onClick={() => setShowImg(false)} className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Cambiar</button>
                            </div>
                        </div>
                    ) : imagePreview ? (
                        <div className="relative group">
                            <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-md shadow-sm" />
                            <button type="button" onClick={() => { setImagePreview(null); setShowImg(true); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14} /></button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                            <Camera className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Subir imagen</span>
                            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                        </label>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Nombre</label>
                        <input
                            {...register('name')}
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                            placeholder="Ej. Hamburguesa Doble"
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

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Descripción</label>
                    <textarea
                        {...register('description')}
                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        placeholder="Describe el plato..."
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Categoría</label>
                    <select
                        {...register('categoryId')}
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Contornos / Adicionales</label>
                    <div className="grid grid-cols-2 gap-3 p-3 border border-gray-100 rounded-md max-h-40 overflow-y-auto dark:border-gray-800">
                        {contornos.map((contorno) => (
                            <div key={contorno.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`c-${contorno.id}`}
                                    checked={selectedContornos.includes(contorno.id.toString())}
                                    onChange={(e) => {
                                        const cid = contorno.id.toString();
                                        if (e.target.checked) setSelectedContornos([...selectedContornos, cid]);
                                        else setSelectedContornos(selectedContornos.filter(c => c !== cid));
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                />
                                <label htmlFor={`c-${contorno.id}`} className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                    {contorno.nombre}
                                </label>
                            </div>
                        ))}
                        {contornos.length === 0 && <p className="text-sm text-gray-500 col-span-2">No hay contornos disponibles.</p>}
                    </div>
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
