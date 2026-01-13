import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

export async function GET(request, { params }) {
    const { id } = await params
    try {
        const order = await prisma.pedido.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                items: {
                    include: {
                        plato: true
                    }
                },
                cliente: true,
                mesa: true,
                Payment: {
                    include: {
                        paymentMethod: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
