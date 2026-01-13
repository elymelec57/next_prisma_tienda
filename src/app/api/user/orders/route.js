
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { authorizeRequest } from '@/libs/auth'

export async function POST(request) {
    const user = await authorizeRequest(request)
    if (!user.authorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { restaurantId, clienteId, nombreCliente, total, estado, mesaId, items } = await request.json()

        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear el Pedido
            const order = await tx.pedido.create({
                data: {
                    restaurantId: Number(restaurantId),
                    clienteId: clienteId ? Number(clienteId) : null,
                    nombreCliente: nombreCliente || null,
                    total: parseFloat(total),
                    estado: estado || 'Pendiente',
                    mesaId: Number(mesaId),
                    // Si el usuario es un empleado (mesero, etc), guardamos su ID
                    // Nota: user.auth.id es el ID del empleado en la tabla Empleado si el rol no es 'user' (admin)
                    empleadoId: user.auth.role !== 'user' ? Number(user.auth.id) : null
                }
            })

            // 2. Crear los Items (de forma masiva o individual)
            // Usamos createMany si no necesitamos los IDs devueltos de inmediato o Promise.all para mayor compatibilidad
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

            // 3. Actualizar estado de la mesa a Ocupada
            await tx.mesa.update({
                where: { id: Number(mesaId) },
                data: { estado: 'Ocupada' }
            })

            return order
        })

        return NextResponse.json({ status: true, order: result }, { status: 201 })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json({ message: 'Error al crear el pedido', error: error.message }, { status: 500 })
    }
}
