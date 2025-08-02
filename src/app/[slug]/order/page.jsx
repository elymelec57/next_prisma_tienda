'use client'

import { FaPlus, FaMinus } from "react-icons/fa";
import { FiXSquare } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { sumarProduct, restarProduct, subCart, reset } from "@/lib/features/cart/orderSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Buy() {
    const dispatch = useAppDispatch()
    const params = useParams()
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        comprobante: '',
        slug: params.slug,
        total: 0,
        order: {}
    });

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onFileChange = (e) => {
        let files = e.target.files;
        let fileReader = new FileReader();
        fileReader.readAsDataURL(files[0]);

        fileReader.onload = (event) => {
            setForm({
                ...form,
                comprobante: event.target.result,
            })
        }
    }

    const order = useAppSelector((state) => state.order.order)
    const count = useAppSelector((state) => state.order.count)

    function sumar(id) {
        dispatch(sumarProduct(id))
    }

    function restar(id) {
        dispatch(restarProduct(id))
    }

    function deleteP(id) {
        dispatch(subCart(id))
    }

    const total = () => {
        let total = 0
        order.forEach(element => {
            total = Number(total) + Number(element.price) * element.count
        });
        form.total = total
        return total
    }

    const buy = async (e)=> {
        e.preventDefault()
        form.order = order
        const OrderSolicitud = await fetch('/api/buy/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({form})
        })

        const res = await OrderSolicitud.json()
        if(res.status){
            alert(res.message)

            dispatch(reset())
            localStorage.removeItem('order');
            localStorage.removeItem('count');
            router.push(`/${params.slug}`)
            
        }else{
            alert(res.message)
        }
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center font-bold uppercase p-4">{params.slug}</h1>
            </div>
            <div className="flex flex-row container mx-auto">
                <div className="basis-2/3 m-2">
                    <div className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {order.map((o) => (
                            <div key={o.id} className="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600">
                                <div className="flex justify-between">
                                    <div>
                                        <p><strong className="fond-bold">{o.name}</strong> {o.price}$</p>
                                        <p><strong className="fond-bold">Cantidad:</strong> {o.count}</p>
                                    </div>
                                    <div className="flex ">
                                        <div>{o.price * o.count} $</div>
                                        <div>
                                            <FaPlus title="Sumar Producto" onClick={() => {
                                                sumar(o.id)
                                            }} className="mx-2 mb-3" />
                                            {
                                                o.count > 0 ? (
                                                    <>
                                                        <FaMinus title="Restar producto" onClick={() => {
                                                            restar(o.id)
                                                        }} className="mx-2" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiXSquare title="Eliminar del carrito" onClick={() => {
                                                            deleteP(o.id)
                                                        }} className="mx-2" />
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center p-2">Cantidad: {count} Total: {total()}$</p>
                    <div className="flex justify-center">
                        <Link href={`/${params.slug}`} className="bg-red-500 text-white p-2 rounded-lg">Atras</Link>
                    </div>
                </div>
                <div className="basis-2/3">
                        <h2 className="text-center font-bold">Formulario de Pago</h2>
                    <form onSubmit={buy} className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" name="email" value={form.email} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input type="text" id="phone" name="phone" onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="comprobante" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comprobante de pago</label>
                            <input type="file"
                                id="comprobante"
                                name="comprobante"
                                onChange={onFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-between">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Comprar</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
