import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()
    
    let updateUser = ''

    const Admin = await prisma.user.findUnique({
        where: { id: Number(params.id) },
        select: {
            name: true,
            password: true,
        },
    });

    if (form.current_password && form.password && form.confirm_password) {

        const match = bcrypt.compareSync(form.current_password, Admin.password);

        if (!match) return NextResponse.json({ status: false, message: 'the password current is incorrect' })
        
        if (form.password !== form.confirm_password) return NextResponse.json({ status: false, message: 'the passwords not match' })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(form.confirm_password, salt);

        updateUser = await prisma.user.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: form.name,
                email: form.email,
                password: hash
            },
        })
    } else {
        updateUser = await prisma.user.update({
            where: {
                id: Number(params.id),
            },
            data: {
                name: form.name,
                email: form.email
            },
        })
    }

    if (updateUser) {
        return NextResponse.json({ status: true, message: 'Update admin successfullys' })
    } else {
        return NextResponse.json({ status: false, message: 'Error admin updating' })
    }
}