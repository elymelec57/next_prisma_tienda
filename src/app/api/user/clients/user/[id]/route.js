import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const restaurant = await prisma.restaurant.findUnique({
        where: {
            userId: Number(params.id)
        },
        include: {
            cliente: true
        },
    })

    return NextResponse.json({ restaurant })
}