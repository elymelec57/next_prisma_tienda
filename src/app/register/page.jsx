'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {

    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const changeImput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const register = async (e) => {
        e.preventDefault()

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form })
        });

        const registerAdmin = await res.json();
        if (registerAdmin.status) {
            router.push('/login')
        } else {
            alert(registerAdmin.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2 font-serif">Join Our Table!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Register for a new account</p>
                </div>

                <form onSubmit={register} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={changeImput}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={changeImput}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            placeholder="name@restaurant.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={changeImput}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            onChange={changeImput}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Register
                        </button>
                        <Link href={'/login'} className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium transition duration-300 ease-in-out">
                            Already have an account? Log In!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
