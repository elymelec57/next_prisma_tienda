import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs';

export async function PUT(request) {
    const { form } = await request.json()
    let update = ''

    const profile = await prisma.user.findUnique({
        where: {
            id: form.id
        }
    });

    if (form.password && form.confirm_password) {

        const match = bcrypt.compareSync(form.password, profile.password);

        if (!match) return NextResponse.json({ status: false, message: 'the password current is incorrect' })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(form.confirm_password, salt);

        update = await prisma.user.update({
            where: {
                id: profile.id,
            },
            data: {
                name: form.name,
                email: form.email,
                password: hash
            },
        })
    } else {
        update = await prisma.user.update({
            where: {
                id: profile.id
            },
            data: {
                name: form.name,
                email: form.email
            }
        });
    }

    (await cookies()).delete('token')

    return NextResponse.json({ status: true, update })
}