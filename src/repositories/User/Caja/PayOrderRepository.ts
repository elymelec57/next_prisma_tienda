import { IPayOrder, PayOrderData, PayOrderResult } from '@/interfaces/User/Caja/PayOrderInterface';
import { prisma } from '@/libs/prisma';

export class PayOrderRepository implements IPayOrder {
    async payOrder(data: PayOrderData): Promise<PayOrderResult> {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el estado del pedido a Pagado
            const updatedOrder = await tx.pedido.update({
                where: { id: data.orderId, restaurantId: data.restaurantId },
                data: { estado: 'Pagado' },
            });

            // 2. Crear o actualizar el registro de pago
            const existingPayment = await tx.payment.findUnique({
                where: { pedidoId: data.orderId },
            });

            let payment;
            if (existingPayment) {
                payment = await tx.payment.update({
                    where: { id: existingPayment.id },
                    data: {
                        status: 'CONFIRMED',
                        paymentMethodId: String(data.paymentMethodId),
                        monto: parseFloat(String(data.monto)),
                    },
                });
            } else {
                payment = await tx.payment.create({
                    data: {
                        monto: parseFloat(String(data.monto)),
                        status: 'CONFIRMED',
                        paymentMethodId: String(data.paymentMethodId),
                        pedidoId: data.orderId,
                        restaurantId: data.restaurantId,
                    },
                });
            }

            // 3. Liberar la mesa si no hay más pedidos pendientes para ella
            if (updatedOrder.mesaId) {
                const otherPendingOrders = await tx.pedido.count({
                    where: {
                        mesaId: updatedOrder.mesaId,
                        restaurantId: data.restaurantId,
                        estado: { not: 'Pagado' },
                        id: { not: data.orderId },
                    },
                });

                if (otherPendingOrders === 0) {
                    await tx.mesa.update({
                        where: { id: updatedOrder.mesaId },
                        data: { estado: 'Libre' },
                    });
                }
            }

            return { updatedOrder, payment };
        });

        return result;
    }
}
