import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma';

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const user = await prisma.user.findUnique({
        where: {
            id: Number(params.id)
        },
        select: {
            name: true,
            email: true
        },
    });
    if (user) {
        return NextResponse.json({ status: true, user })
    } else {
        return NextResponse.json({ status: false })
    }
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()

    const updateUser = await prisma.user.update({
        where: {
            id: Number(params.id),
        },
        data: {
            name: form.name,
            email: form.email
        },
    })

    if (updateUser) {
        return NextResponse.json({ status: true, message: 'Update user successfullys' })
    } else {
        return NextResponse.json({ status: false, message: 'Error updating' })
    }
}

export async function DELETE(request,segmentData) {
    const params = await segmentData.params
    const deleteUser = await prisma.user.delete({
        where: {
            id: Number(params.id),
        },
    })

    if(deleteUser){
        return NextResponse.json({status: true, message: 'User delete'})
    }else{
        return NextResponse.json({status: false, message: 'Error delete'})
    }
}