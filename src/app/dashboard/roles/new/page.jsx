'use client'

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function RegisterRole() {

    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.id) {
            consultRol(params.id)
        }
    }, [])

    async function consultRol(id) {
        const query = await fetch(`/api/roles/${id}`);
        const { rol } = await query.json()

        setForm({
            name: rol.name,
        })
    }

    const [form, setForm] = useState({
        name: '',
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
            const res = await fetch(`/api/roles/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });

            const updateRol = await res.json();
            if (updateRol.status) {
                router.push('/dashboard/roles')
            } else {
                alert(updateRol.message)
            }
        } else {
            const res = await fetch('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form })
            });

            const registerRole = await res.json();
            if (registerRole.status) {
                router.push('/dashboard/roles')
            } else {
                alert(registerRole.message)
            }
        }
    }

    return (
        <div className="mt-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-1">Roles register</h1>
            </div>

            <form onSubmit={register} className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={changeImput} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>               
                <div className="flex justify-center">
                    <div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                    <div>
                        <Link className="underline underline-offset-1 mx-4" href={'/dashboard/roles'}>Back</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
