import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'

export async function GET(request, segmentData) {
    const params = await segmentData.params

    const business = await prisma.business.findUnique({
        select:{
            id: true
        },
        where:{
            userId: Number(params.id)
        }
    })

    const clients = await prisma.client.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
        where: {
            business: {
                id: business.id
            }
        },
    });
    return NextResponse.json({clients})
}