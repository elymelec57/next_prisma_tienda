'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function Register() {

    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.id) {
            consultUser(params.id)
        }
    }, [])

    async function consultUser(id) {
        const query = await fetch(`/api/user/${id}`);
        const { user } = await query.json()

        setForm({
            name: user.name,
            email: user.email
        })
    }

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

        if (params.id) {
            const res = await fetch(`/api/user/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });

            const updateUser = await res.json();
            if (updateUser.status) {
                router.push('/dashboard/user')
            } else {
                alert(updateUser.message)
            }
        } else {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });

            const registerAdmin = await res.json();
            if (registerAdmin.status) {
                router.push('/dashboard/user')
            } else {
                alert(registerAdmin.message)
            }
        }
    }

    return (
        <div className="mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Users register</h1>
            </div>

            <form onSubmit={register} className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                </div>
                {
                    params.id ? (
                        <>
                        </>
                    ) : (
                        <>
                            <div className="mb-5">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" id="password" name="password" onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="password" id="confirm_password" name="confirm_password" onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                        </>
                    )
                }
                {/* <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
            </div>
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
          </div> */}
                <div className="flex justify-center">
                    <div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                    <div>
                        <Link className="underline underline-offset-1 mx-4" href={'/dashboard/user'}>Back</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
