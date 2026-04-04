import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, segmentData) {
    const params = await segmentData.params
    const restaurant = await prisma.restaurant.findUnique({
        select: {
            id: true,
            currency: true
        },
        where: {
            userId: Number(params.id)
        }
    });

    const contornos = await prisma.contornos.findMany({
        select: {
            id: true,
            nombre: true,
            price: true
        },
        where: {
            restaurantId: restaurant.id
        }
    })

    return NextResponse.json({ contornos, currency: restaurant.currency })
}