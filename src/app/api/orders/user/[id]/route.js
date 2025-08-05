import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const orders = await prisma.pedido.findMany({
        select: {
            id: true,
            order: true,
            priceFull: true,
            status: true,
            userId: true,
            comprobante: true
        },
        where: {
            user: {
                id: Number(params.id)
            }
        },
    });
    return NextResponse.json({ status: true, orders})
}