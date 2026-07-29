import { IGetPendingOrders } from '@/interfaces/User/Caja/GetPendingOrdersInterface';
import { prisma } from '@/libs/prisma';

export class GetPendingOrdersRepository implements IGetPendingOrders {
    async getPendingOrders(restaurantId: number): Promise<any[]> {
        const orders = await prisma.pedido.findMany({
            where: {
                restaurantId,
                estado: { not: 'Pagado' },
            },
            include: {
                cliente: true,
                mesa: true,
                items: {
                    include: {
                        plato: true,
                    },
                },
                Payment: {
                    include: {
                        paymentMethod: true,
                    },
                },
            },
            orderBy: { fechaHora: 'desc' },
        });

        // Añadir URL de comprobante si existe imagen asociada
        for (const order of orders) {
            if (order.Payment && (order.Payment as any).mainImageId) {
                const image = await prisma.image.findUnique({
                    where: { id: (order.Payment as any).mainImageId },
                    select: { url: true },
                });
                if (image) {
                    (order.Payment as any).receiptUrl = image.url;
                }
            }
        }

        return orders;
    }
}
