'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { useState } from "react";

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirm_password: ''
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: data })
        });

        const registerAdmin = await res.json();
        setIsLoading(false);

        if (registerAdmin.status) {
            router.push('/login');
        } else {
            alert(registerAdmin.message);
        }
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="hidden bg-muted lg:block relative h-full w-full bg-gray-900 order-last lg:order-first">
                <Image
                    src="https://duavmk3fx3tdpyi9.public.blob.vercel-storage.com/public/register-bg.png"
                    alt="Fresh ingredients cooking scene"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Create an Account
                        </h1>
                        <p className="text-sm text-muted-foreground text-gray-500">
                            Join us today just entering your details below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:ring-white transition-all duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <p className="text-sm font-medium text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:ring-white transition-all duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <p className="text-sm font-medium text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        id="password"
                                        type="password"
                                        {...register('password')}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50 dark:focus:ring-white transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirm_password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        id="confirm_password"
                                        type="password"
                                        {...register('confirm_password')}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-9 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50 dark:focus:ring-white transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.confirm_password && <p className="text-sm font-medium text-red-500">{errors.confirm_password.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground bg-white dark:bg-gray-900 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground text-gray-500">
                            Already have an account?{" "}
                        </span>
                        <Link
                            href="/login"
                            className="font-semibold text-gray-900 hover:underline underline-offset-4 dark:text-gray-50"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
