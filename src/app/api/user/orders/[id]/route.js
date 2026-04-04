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
        const { total, items, nombreCliente, estado, mesaId } = await request.json()

        // Si se envió solo el estado (para el flujo de cocina/mesero), no actualizamos la comanda
        if (estado && !items) {
            const result = await prisma.pedido.update({
                where: { id: Number(id) },
                data: { estado }
            })
            if (estado === 'Servido') {
                await prisma.mesa.update({
                    where: { id: Number(mesaId) },
                    data: { estado: 'Servir' }
                })
            }

            return NextResponse.json({ status: true, order: result })
        }

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
