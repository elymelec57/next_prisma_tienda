import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
    const { form, user } = await request.json()

    const restaurant = await prisma.restaurant.findUnique({
        select: {
            id: true,
        },
        where: {
            userId: Number(user)
        }
    })

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const contorno = await prisma.contornos.create({
        data: {
            nombre: form.name,
            price: Number(form.price),
            restaurantId: restaurant.id
        }
    })

    return NextResponse.json({ status: true, message: 'Contorno creado correctamente' })
}