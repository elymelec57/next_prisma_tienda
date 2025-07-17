import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma';

export async function GET(request,segmentData) {

    const params = await segmentData.params
    const product = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true
        },
        where: {
            user: {
                id: Number(params.id) 
            }
        },
    });
    return NextResponse.json({product})
}