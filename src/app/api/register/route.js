import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    const { form } = await request.json()

    if (form.password != form.confirm_password) {
        return NextResponse.json({ status: false, message: 'the password does not match' })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(form.confirm_password, salt);

    const user = await prisma.user.create({
        data: {
            email: form.email,
            name: form.name,
            password: hash,
            roles: {
                connect: {id: 2} //roles.map((role) => ({ userId: role.id })),
            },
        },
    });

    if(user.id){
        return NextResponse.json({status: true, message: 'User created successfully'})
    }else{
        return NextResponse.json({ message: 'Error creating User' })
    }
}