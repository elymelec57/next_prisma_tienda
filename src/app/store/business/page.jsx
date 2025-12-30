'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { toast } from 'react-toastify';

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

    const [form, setForm] = useState({
        id: '',
        name: '',
        slogan: '',
        phone: '',
        direcction: '',
        slug: '',
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
        const data = await fetch(`/api/business/user/${userId}`)
        const { rest } = await data.json()

        if (rest) {
            setForm({
                ...form,
                id: rest.id,
                name: rest.name,
                slogan: rest.slogan,
                phone: rest.phone,
                direcction: rest.direcction,
                slug: rest.slug
            })

            setImage({
                ...image,
                mainImageId: rest.mainImageId,
                url: rest.url
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

        try {
            if (!form) {
                const storeBusiness = await fetch(`/api/business`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form, userId, logo: newLogo.pathname })
                });
                const rest = await storeBusiness.json()
                if (rest) {
                    const response = await fetch(
                        `/api/avatar/upload?filename=${image.image.name}&model=restaurant&id=${rest.id}`,
                        {
                            method: 'POST',
                            body: image.image,
                        },
                    );
                    toast.success('Business stored successfully')
                    router.refresh()
                    consultProduct()
                }
            } else {
                const updateBusiness = await fetch(`/api/business/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form })
                });

                const rest = await updateBusiness.json()
                if (rest) {

                    if (image.image) {
                        const response = await fetch(
                            `/api/avatar/update?filename=${image.image.name}&model=restaurant&id=${rest.id}&mainImage=${rest.mainImage}`,
                            {
                                method: 'POST',
                                body: image.image,
                            },
                        );
                    }

                    toast.success('Business updated successfully')
                    setShowImg(true)
                    router.refresh()
                    consultProduct()
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Error al guardar el negocio', error)
        }

    }

    return (
        <div className="mt-10">
            {
                form.id ? (
                    <>
                        <div className="flex justify-end">
                            <button onClick={irPage} className="bg-green-500 tex-white p-2 rounded-md underline underline-offset-1">Ir a mi pagina</button>
                        </div>
                    </>
                ) : (
                    <></>
                )
            }

            <form onSubmit={businessSave} className="max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-1">Información del restaurant</h1>
                </div>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name business</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="slogan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Slogan business</label>
                    <input type="text" id="slogan" name="slogan" value={form.slogan} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                    <input type="number" id="phone" name="phone" value={form.phone} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="direcction" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input type="text" id="address" name="direcction" value={form.direcction} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                {

                    image.mainImageId != null && showImg ? (
                        <>
                            <div className="">
                                <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${image.url}`} alt="" />
                                <button onClick={() => {
                                    setShowImg(false)
                                }} className="p-2 text-center underline underline-offset-1">Subir otro logo</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-5">
                                <label htmlFor="logo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo</label>
                                <input type="file"
                                    id="logo"
                                    name="logo"
                                    onChange={onFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {imagePreview && ( // Display image preview if available
                                    <div className="mb-5">
                                        <img src={imagePreview} alt="Image Preview" className="mt-2 max-w-full h-auto rounded-lg shadow-md" />
                                    </div>
                                )}
                            </div>
                            {
                                image.mainImageId != null && !showImg ? (
                                    <>
                                        <button onClick={() => {
                                            setShowImg(true)
                                        }} className="p-2 text-center underline underline-offset-1">No subir logo</button>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )
                }
                <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <Link className="text-blue-700 hover:underline font-medium rounded-lg text-sm w-full py-2.5 text-center border border-blue-700 dark:text-blue-500 dark:border-blue-500" href={'/store'}>Inicio</Link>
                </div>
            </form>
        </div>
    )
}