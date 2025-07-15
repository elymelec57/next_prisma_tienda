import { NextResponse } from "next/server";
import { prisma } from '../../../libs/prisma'
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

            let data = {
                name: Auth.name,
                email: Auth.email,
                role: Auth.roles[0].name
            }
            
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: data
            }, process.env.JWT_TOKEN);

            cookieStore.set({
                name: 'token',
                value: token,
                httpOnly: false,
                path: '/',
            });

            // if(data.role == 'Admin'){
            //     console.log(request.url)
            //     return NextResponse.redirect(new URL('/dashboard', request.url))
            // }
            // return NextResponse.redirect(new URL('/store', request.url))
            return NextResponse.json({ status: true, message: 'login successfully', auth: data  })
        } else {
            return NextResponse.json({ status: false, message: 'not match password' })
        }
    } else {
        return NextResponse.json({ status: false, message: 'User not found ' })
    }

}