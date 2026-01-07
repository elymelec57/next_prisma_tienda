'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { InputWithIcon } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {

    const router = useRouter()

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
        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form: data })
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
            <Card className="max-w-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
                <CardHeader>
                    <CardTitle>Join Our Table!</CardTitle>
                    <CardDescription>Register for a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <InputWithIcon
                                icon={<User className="h-5 w-5 text-gray-400" />}
                                type="text"
                                {...register('name')}
                                id="name"
                                name="name"
                                required
                            />
                            {errors.name && <p className="error">{errors.name.message}</p>}
                        </div>
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
                        <div>
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <InputWithIcon
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                type="password"
                                {...register('confirm_password')}
                                id="confirm_password"
                                name="confirm_password"
                                required
                            />
                            {errors.confirm_password && <p className="error">{errors.confirm_password.message}</p>}
                        </div>
                        <CardFooter>
                            <Button type="submit">
                                Register
                            </Button>
                            <Link href={'/login'} className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium transition duration-300 ease-in-out">
                                Already have an account? Log In!
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
