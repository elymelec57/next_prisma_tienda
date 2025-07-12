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
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: Auth
            }, process.env.JWT_TOKEN);

            cookieStore.set({
                name: 'token',
                value: token,
                httpOnly: true,
                path: '/',
            });

            return NextResponse.json({ status: true, message: 'login successfully' })
        } else {
            return NextResponse.json({ status: false, message: 'not match password' })
        }
    } else {
        return NextResponse.json({ status: false, message: 'User not found ' })
    }

}