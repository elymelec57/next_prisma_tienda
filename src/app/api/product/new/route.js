import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import upload from '@/libs/upload'

export async function POST(request) {

    const { form } = await request.json()
    
    const rest = await prisma.restaurant.findUnique({
        where: {
            userId: Number(form.userId)
        },
        select: {
            id: true
        }
    })

    const plato = await prisma.plato.create({
        data: {
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            disponible: true,
            restaurant: {
                connect: {
                    id: rest.id,
                },
            },
            categoria: {
                connect: {
                    id: Number(form.categoryId),
                }
            }
        },
        include: {
            restaurant: true,
            categoria: true,
        },
    });

    if(plato){
        return NextResponse.json({ status: true, message: 'Plato creado con exito', id: plato.id })
    }
    return NextResponse.json({ status: false, message: 'Ocurrio en error inesperado' })
}