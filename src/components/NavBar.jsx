'use client'
import Link from "next/link"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { auth } from "../lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";

export default function NavBar({ data }) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    dispatch(auth(data))

    const [nav, setNav] = useState(true)

    function change() {
        setNav(!nav)
    }

    return (
        <div>
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={'/dashboard'} className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"> */}
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">App Store</span>
                        <span className="self-center text-1xl font-semibold whitespace-nowrap dark:text-white">{auth.email}</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <a onClick={() => {
                            Cookies.remove('token', { path: '/' })
                            router.push('/login')
                        }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Exit</a>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <CiMenuBurger onClick={() => {
                                change()
                            }} />
                            {/* <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg> */}
                        </button>
                    </div>
                    <div className="items-center justify-between w-full md:flex md:w-auto md:order-1" style={{ display: nav ? 'block' : 'none' }} id="navbar-sticky">
                        {
                            <>
                                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                    <li>
                                        <Link href={'/store/plato'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Platos</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/ingredientes'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Ingredientes</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/contornos'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contornos</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/orders'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pedidos</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/clients'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Clientes</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/profile'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Perfil usuario</Link>
                                    </li>
                                    <li>
                                        <Link href={'/store/business'} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Perfil restaurant</Link>
                                    </li>
                                </ul>
                            </>
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}
