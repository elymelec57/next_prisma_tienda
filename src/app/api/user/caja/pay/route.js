
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { authorizeRequest } from '@/libs/auth'

export async function POST(request) {
    try {
        const user = await authorizeRequest(request)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { orderId, paymentMethodId, monto } = await request.json();

        console.log(orderId, paymentMethodId, monto)
        // Iniciar transacción
        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el pedido
            const updatedOrder = await tx.pedido.update({
                where: { id: orderId, restaurantId: user.auth.restauranteId },
                data: { estado: 'Pagado' }
            });

            // 2. Crear el registro de pago
            const payment = await tx.payment.create({
                data: {
                    monto: parseFloat(monto),
                    status: 'CONFIRMED',
                    paymentMethodId,
                    pedidoId: orderId,
                    restaurantId: user.auth.restauranteId
                }
            });

            // 3. Liberar la mesa (solo si no hay más pedidos pendientes para esa mesa)
            if (updatedOrder.mesaId) {
                const otherPendingOrders = await tx.pedido.count({
                    where: {
                        mesaId: updatedOrder.mesaId,
                        restaurantId: user.auth.restauranteId,
                        estado: { not: 'Pagado' },
                        id: { not: orderId } // Excluir el pedido actual
                    }
                });

                if (otherPendingOrders === 0) {
                    await tx.mesa.update({
                        where: { id: updatedOrder.mesaId },
                        data: { estado: 'Libre' }
                    });
                }
            }

            return { updatedOrder, payment };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
