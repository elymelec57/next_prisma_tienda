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

export async function PATCH(request, { params }) {
    const { id } = await params
    try {
        const { total, items, nombreCliente } = await request.json()

        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el Pedido
            const order = await tx.pedido.update({
                where: { id: Number(id) },
                data: {
                    total: parseFloat(total),
                    nombreCliente: nombreCliente || null,
                }
            })

            // 2. Eliminar items anteriores
            await tx.itemPedido.deleteMany({
                where: { pedidoId: Number(id) }
            })

            // 3. Crear los nuevos items
            const orderItemsEntries = items.map((item) => ({
                pedidoId: order.id,
                platoId: Number(item.platoId),
                cantidad: Number(item.cantidad),
                precioUnitario: parseFloat(item.precioUnitario),
                nota: item.nota || ""
            }))

            await tx.itemPedido.createMany({
                data: orderItemsEntries
            })

            return order
        })

        return NextResponse.json({ status: true, order: result })
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ message: 'Error al actualizar el pedido', error: error.message }, { status: 500 })
    }
}
