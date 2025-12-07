'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

export default function Business() {

    const router = useRouter()
    const userId = useAppSelector((state) => state.auth.auth.id)
    useEffect(() => {
        consultProduct()
    }, [])

    const [showImg, setShowImg] = useState(true)
    const [logoCurrent, setLogourrent] = useState('')

    const [form, setForm] = useState({
        id: '',
        name: '',
        slogan: '',
        phone: '',
        direcction: '',
        logo: '',
        slug: '',
        logoCurrent: '',
    });

    const onFileChange = (e) => {
        let files = e.target.files[0];
        setForm({
            ...form,
            logo: files,
        })
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
                logoCurrent: rest.logo,
                slug: rest.slug
            })
            setLogourrent(rest.logo)
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
        let res = ''

        const response = await fetch(
            `/api/avatar/upload?filename=${form.logo.name}`,
            {
                method: 'POST',
                body: form.logo,
            },
        );
        const newLogo = await response.json();

        if (newLogo.pathname) {
            if (form.id != '') {
                res = await fetch(`/api/business/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form })
                });
            } else {
                res = await fetch(`/api/business`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form, userId, logo: newLogo.pathname })
                });
            }

            const businessUpdate = await res.json();
            if (businessUpdate.status) {
                router.refresh()
                alert(businessUpdate.message)
                setShowImg(true)
                consultProduct()
            } else {
                alert(businessUpdate.message)
            }
        } else {
            alert('Error al subir el logo')
        }
    }

    return (
        <div className="mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Business Register</h1>
            </div>

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

            <form onSubmit={businessSave} className="max-w-sm mx-auto">
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
                    logoCurrent != '' && showImg ? (
                        <>
                            <div className="">
                                <img src={`https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/${logoCurrent}`} alt="" />
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
                            </div>
                            {
                                logoCurrent != '' && !showImg ? (
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
                {/* <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
            </div>
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
          </div> */}
                <div className="flex justify-center mb-4">
                    <div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                    <div>
                        <Link className="underline underline-offset-1 mx-4" href={'/store'}>Home</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}