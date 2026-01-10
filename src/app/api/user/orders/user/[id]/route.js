import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const orders = await prisma.pedido.findMany({
        where: {
            restaurantId: Number(params.id)
        },
        include: {
            cliente: true,
            Payment: true
        }
    });

    return NextResponse.json({ status: true, orders })
}