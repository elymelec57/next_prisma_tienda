'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { plato } from '@/app/schemas/platoSchema';

export default function Product() {

    const router = useRouter()
    const params = useParams()

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [contornos, setContornos] = useState([]);
    const [selectedContornos, setSelectedContornos] = useState([]);

    const [userId, setUserId] = useState(useAppSelector((state) => state.auth.auth.id))
    const [image, setImage] = useState({
        mainImageId: null,
        url: '',
        image: ''
    })
    const [showImg, setShowImg] = useState(true);
    const [imagePreview, setImagePreview] = useState(image.image); // New state for image preview

    useEffect(() => {
        fetchCategories();
        if (params.id) {
            consultProduct();
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchContornos();
        }
    }, [userId]);

    const {
        register,     // Función para registrar los inputs
        handleSubmit, // Función que maneja el envío (solo si es válido)
        formState: { errors, isSubmitting }, // Estado del formulario (errores y envío)
        setValue
    } = useForm({
        resolver: zodResolver(plato), // Aquí conectamos Zod
        defaultValues: {
            name: '',
            description: '',
            price: '',
            image: '',
            categoryId: ''
        },
    });

    const onFileChange = (e) => {
        let file = e.target.files[0]; // Changed 'files' to 'file' for clarity

        setImage({
            ...image,
            image: file,
        })

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = (event) => {
            setImagePreview(event.target.result); // Set image preview
        };
    }

    async function consultProduct() {
        const data = await fetch(`/api/product/${params.id}`)
        const { plato } = await data.json()

        setValue("name", plato.nombre)
        setValue("description", plato.descripcion)
        setValue("price", plato.precio)
        setValue("categoryId", plato.categoriaId)
        setSelectedCategory(plato.categoriaId)
        setImage({
            ...image,
            mainImageId: plato.mainImageId,
            url: plato.url
        })
        if (plato.contornos) {
            setSelectedContornos(plato.contornos.map(c => c.id.toString()));
        }
    }

    async function fetchCategories() {
        const res = await fetch('/api/category');
        const categories = await res.json();
        setCategories(categories);
    }

    async function fetchContornos() {
        if (!userId) return;
        const res = await fetch(`/api/contornos?userId=${userId}`);
        const data = await res.json();
        setContornos(data);
    }

    const onSubmit = async (data) => {

        if (params.id) {
            return updatePlato(data)
        }

        const res = await fetch(`/api/product/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: { ...data, contornos: selectedContornos }, user: userId })
        });

        const plato = await res.json();
        if (plato.status) {

            const response = await fetch(
                `/api/avatar/upload?filename=${image.image.name}&model=plato&id=${plato.id}`,
                {
                    method: 'POST',
                    body: image.image,
                },
            );

            const newBlob = await response.json();

            if (newBlob.status) {
                toast.success(plato.message);
                router.refresh()
                router.push('/store/plato')
            } else {
                toast.error(newBlob.message)
                router.refresh()
                router.push('/store/plato')
            }

        } else {
            toast.error(plato.message)
        }
    }

    const updatePlato = async (data) => {
        const update = await fetch(`/api/product/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: { ...data, contornos: selectedContornos } })
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
                    <h1 className="text-2xl font-bold mb-1 mt-20">{params.id ? 'Editando plato' : 'Registro de platos'}</h1>
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                    <input type="text" id="name" name="name" {...register('name')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcción</label>
                    <input type="text" id="description" name="description" {...register('description')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors.description && <p className="error">{errors.description.message}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                    <input type="number" id="price" name="price" {...register('price')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {errors.price && <p className="error">{errors.price.message}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                    <select
                        id="category"
                        name="category"
                        {...register('categoryId')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    >
                        <option value="">Selecciona la categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contornos</label>
                    <div className="grid grid-cols-2 gap-2">
                        {contornos.map((contorno) => (
                            <div key={contorno.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`contorno-${contorno.id}`}
                                    value={contorno.id}
                                    checked={selectedContornos.includes(contorno.id.toString())}
                                    onChange={(e) => {
                                        const id = contorno.id.toString();
                                        if (e.target.checked) {
                                            setSelectedContornos([...selectedContornos, id]);
                                        } else {
                                            setSelectedContornos(selectedContornos.filter(c => c !== id));
                                        }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor={`contorno-${contorno.id}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {contorno.nombre}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {
                    image.mainImageId != null && showImg ? (
                        <>
                            <div className="">
                                <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${image.url}`} alt="" />
                                <button onClick={() => {
                                    setShowImg(false)
                                }} className="p-2 text-center underline underline-offset-1">Subir otra imagen</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-5">
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imagen</label>
                                <input type="file"
                                    id="image"
                                    name="image"
                                    onChange={onFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            {imagePreview && ( // Display image preview if available
                                <div className="mb-5">
                                    <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-auto rounded-lg shadow-md" />
                                </div>
                            )}
                            {
                                !showImg ? (
                                    <>
                                        <button onClick={() => {
                                            setShowImg(true);
                                            setImagePreview(null); // Clear preview when switching back
                                        }} className="p-2 text-center underline underline-offset-1">No subir imagen</button>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )
                }

                <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar</button>
                    <Link className="text-blue-700 hover:underline font-medium rounded-lg text-sm w-full py-2.5 text-center border border-blue-700 dark:text-blue-500 dark:border-blue-500" href={'/store/plato'}>Atras</Link>
                </div>
            </form>
        </div>
    )
}