'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';

export default function Login() {

    const router = useRouter()

    // 1. Configurar useForm con el resolvedor de Zod
    const {
        register,     // Función para registrar los inputs
        handleSubmit, // Función que maneja el envío (solo si es válido)
        formState: { errors, isSubmitting }, // Estado del formulario (errores y envío)
    } = useForm({
        resolver: zodResolver(loginSchema), // Aquí conectamos Zod
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        // Aquí harías la llamada a tu API (ej. con fetch o Axios)
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({form:data})
        });

        const login = await res.json();
        if (login.status) {
            if (login.auth.role == 'User') {
                router.push('/store')
            } else {
                router.push('/dashboard')
            }
        } else {
            alert(login.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2 font-serif">Welcome Back!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Log in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            id="email"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            placeholder="name@restaurant.com"
                            required
                        />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            id="password"
                            name="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 transition duration-300 ease-in-out"
                            required
                        />
                         {errors.password && <p className="error">{errors.password.message}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Log In
                        </button>
                        <Link href={'/register'} className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium transition duration-300 ease-in-out">
                            Don't have an account? Register!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}