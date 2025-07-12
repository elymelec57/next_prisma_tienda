import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma';

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const rol = await prisma.rol.findUnique({
        where: {
            id: Number(params.id)
        },
    });
    if (rol) {
        return NextResponse.json({ status: true, rol })
    } else {
        return NextResponse.json({ status: false })
    }
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()

    const updaterol = await prisma.rol.update({
        where: {
            id: Number(params.id),
        },
        data: {
            name: form.name,
        },
    })

    if (updaterol) {
        return NextResponse.json({ status: true, message: 'Update rol successfullys' })
    } else {
        return NextResponse.json({ status: false, message: 'Error rol updating' })
    }
}

export async function DELETE(request,segmentData) {
    const params = await segmentData.params
    const deleteRol = await prisma.rol.delete({
        where: {
            id: Number(params.id),
        },
    })

    if(deleteRol){
        return NextResponse.json({status: true, message: 'Rol delete'})
    }else{
        return NextResponse.json({status: false, message: 'Error Rol delete'})
    }
}