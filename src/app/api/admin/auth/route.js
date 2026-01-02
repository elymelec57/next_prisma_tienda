import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export async function POST(request) {
    const { form } = await request.json()

    const Auth = await prisma.user.findUnique({
        where: { email: form.email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            roles: {
                select: {
                    name: true
                },
            },
        },
    });

    if (form.email == '' && form.password == '') return NextResponse.json({ status: false, message: 'Enter data' })

    if (Auth) {
        const match = bcrypt.compareSync(form.password, Auth.password);
        if (match) {

            let data = {
                id: Auth.id,
                name: Auth.name,
                email: Auth.email,
                role: Auth.roles[0].name
            }

            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: data
            }, process.env.JWT_TOKEN);

            const response = NextResponse.json({ status: true, message: 'login exitoso', auth: data })
            response.cookies.set('auth_token', token, {
                httpOnly: true, // No accesible desde JS de Vue (Protección XSS)
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 3600, // 1 hora
            });

            return response

        } else {
            return NextResponse.json({ status: false, message: 'not match password' })
        }
    } else {
        return NextResponse.json({ status: false, message: 'User not found ' })
    }

}