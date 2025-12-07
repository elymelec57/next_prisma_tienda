'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

export default function Product() {

    const router = useRouter()
    const params = useParams()

    const [categories, setCategories] = useState([]);
    const [filename, setFilename] = useState()
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
        if (params.id) {
            consultProduct();
        }
    }, []);

    const [showImg, setShowImg] = useState(true);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        mainImageId: '',
        url: '',
        categoryId: '',
        userId: useAppSelector((state) => state.auth.auth.id)
    });
    const [imagePreview, setImagePreview] = useState(form.image); // New state for image preview

    const onFileChange = (e) => {
        let file = e.target.files[0]; // Changed 'files' to 'file' for clarity
        //setFilename(file.name)
        setForm({
            ...form,
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
        console.log(plato)
        setForm({
            name: plato.nombre,
            description: plato.descripcion,
            price: plato.precio,
            mainImageId: plato.mainImageId,
            url: plato.url,
            categoryId: plato.categoriaId
        })
        setSelectedCategory(plato.categoriaId)
    }

    async function fetchCategories() {
        const res = await fetch('/api/category');
        const categories = await res.json();
        setCategories(categories);
    }

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const changeCategory = (e) => {
        setSelectedCategory(e.target.value);
        setForm({
            ...form,
            categoryId: e.target.value
        });
    };

    const product = async (e) => {
        e.preventDefault()
        let res = ''

        if (params.id) {
            res = await fetch(`/api/product/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });
        } else {
            res = await fetch(`/api/product/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });
        }

        const plato = await res.json();
        if (plato.status) {

            const response = await fetch(
                `/api/avatar/upload?filename=${form.image.name}&id=${plato.id}`,
                {
                    method: 'POST',
                    body: form.image,
                },
            );
            const newBlob = await response.json();

            if(newBlob.status){
                router.refresh()
                router.push('/store/plato')
            }else{
                alert(newBlob.message)
                router.refresh()
                router.push('/store/plato')
            }
            
        } else {
            alert(product.message)
        }

    }


    return (
        <div className="mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Registo de platos</h1>
            </div>

            <form onSubmit={product} className="max-w-sm mx-auto p-4 sm:max-w-md md:max-w-lg">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcción</label>
                    <input type="text" id="description" name="description" value={form.description} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                    <input type="number" id="price" name="price" value={form.price} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
                    <select
                        id="category"
                        name="category"
                        value={selectedCategory}
                        onChange={changeCategory}
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
                {
                    form.mainImageId != null ? (
                        <>
                            <div className="">
                                <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${form.url}`} alt="" />
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
                                form.imageCurrent != '' && !showImg ? (
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
                {/* <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
            </div>
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
          </div> */}
                <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <Link className="text-blue-700 hover:underline font-medium rounded-lg text-sm w-full py-2.5 text-center border border-blue-700 dark:text-blue-500 dark:border-blue-500" href={'/store/plato'}>Atras</Link>
                </div>
            </form>
        </div>
    )
}