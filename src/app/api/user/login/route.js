import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

export async function POST(request) {
    const { form } = await request.json()
    const cookieStore = await cookies()

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

    const restaurante = await prisma.restaurant.findUnique({
        where: { userId: Auth.id },
        select: {
            id: true,
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
                role: Auth.roles[0].name,
                restauranteId: restaurante == null ? null : restaurante.id
            }

            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: data
            }, process.env.JWT_TOKEN);

            cookieStore.set({
                name: 'token',
                value: token,
                httpOnly: true, // No accesible desde JS de Vue (Protección XSS)
                path: '/',
            });

            return NextResponse.json({ status: true, message: 'login successfully', auth: data })
        } else {
            return NextResponse.json({ status: false, message: 'not match password' })
        }
    } else {
        return NextResponse.json({ status: false, message: 'User not found ' })
    }

}