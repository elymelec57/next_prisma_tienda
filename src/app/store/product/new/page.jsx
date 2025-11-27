'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

export default function Product() {

    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            consultProduct()
        }
    }, [])

    const [showImg, setShowImg] = useState(true)
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        imageCurrent: '',
        userId: useAppSelector((state) => state.auth.auth.id)
    });

    const onFileChange = (e) => {
        let files = e.target.files[0];
        // let fileReader = new FileReader();
        // fileReader.readAsDataURL(files[0]);

        // fileReader.onload = (event) => {
        //     setForm({
        //         ...form,
        //         image: event.target.result,
        //     })
        // }
        setForm({
            ...form,
            image: files,
        })
    }

    async function consultProduct() {
        const data = await fetch(`/api/product/${params.id}`)
        const { product } = await data.json()

        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            imageCurrent: product.image
        })
    }

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const product = async (e) => {
        e.preventDefault()
        let res = ''

        const response = await fetch(
            `/api/avatar/upload?filename=${form.image.name}`,
            {
                method: 'POST',
                body: form.image,
            },
        );
        const newBlob = await response.json();

        if (newBlob.pathname) {
            if (params.id) {
                res = await fetch(`/api/product/${params.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form })
                });
            } else {
                res = await fetch('/api/product/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form, image: newBlob.pathname })
                });
            }

            const product = await res.json();
            if (product.status) {
                router.refresh()
                router.push('/store/product')
            } else {
                alert(product.message)
            }
        } else {
            alert('Error al crear el producto')
        }
    }


    return (
        <div className="mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Product register</h1>
            </div>

            <form onSubmit={product} className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name Product</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input type="text" id="description" name="description" value={form.description} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input type="number" id="price" name="price" value={form.price} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                {
                    form.imageCurrent != '' && showImg ? (
                        <>
                            <div className="">
                                <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${form.imageCurrent}`} alt="" />
                                <button onClick={() => {
                                    setShowImg(false)
                                }} className="p-2 text-center underline underline-offset-1">Subir otra imagen</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-5">
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                                <input type="file"
                                    id="image"
                                    name="image"
                                    onChange={onFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            {
                                form.imageCurrent != '' && !showImg ? (
                                    <>
                                        <button onClick={() => {
                                            setShowImg(true)
                                        }} className="p-2 text-center underline underline-offset-1">No subir imagen</button>
                                    </>
                                ) : (
                                    <></>
                                )
                            }
                        </>
                    )
                }
                {/* <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
            </div>
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
          </div> */}
                <div className="flex justify-between">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <Link className="underline underline-offset-1" href={'/store/product'}>Back</Link>
                </div>
            </form>
        </div>
    )
}