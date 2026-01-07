'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { InputWithIcon } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Mail, Lock } from 'lucide-react';

export default function Login() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        const res = await fetch('/api/user/login', {
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
            <Card className="max-w-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
                <CardHeader>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Log in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <InputWithIcon
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                type="email"
                                {...register('email')}
                                id="email"
                                name="email"
                                placeholder="name@restaurant.com"
                                required
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <InputWithIcon
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                type="password"
                                {...register('password')}
                                id="password"
                                name="password"
                                required
                            />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>
                        <CardFooter>
                            <Button type="submit">
                                Log In
                            </Button>
                            <Link href={'/register'} className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium transition duration-300 ease-in-out">
                                Don't have an account? Register!
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}