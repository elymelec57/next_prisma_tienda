import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma'

export async function POST(request) {
    const data = await request.json()

    //return NextResponse.json(data.productos)

    const business = await prisma.business.findFirst({
      where: {
        phone: String(data.phone),
      },
    });

    //return NextResponse.json(business)

    const order = await prisma.pedido.create({
        data: {
            order: data.productos,
            priceFull: data.totalPago,
            status: false,
            comprobante: "url",
            user: {
                connect: {
                    id: business.userId,
                },
            },
        }
    })

    const cliente = await prisma.client.create({
        data: {
            name: data.cliente.name,
            email: data.cliente.correo,
            phone: String(data.cliente.celular),
            business: {
                connect: {
                    id: business.id,
                },
            },
            pedido: {
                connect: {
                    id: order.id,
                },
            },
        }
    })

    if(cliente){
        return NextResponse.json({ status: true, message: 'Orden solicitado con exito' })
    }
    return NextResponse.json({ status: false, message: 'Error al solicitar la orden' })
}