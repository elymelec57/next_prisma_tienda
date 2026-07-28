import { ICreateOrder, CreateOrderData } from '@/interfaces/User/Order/CreateOrderInterface';
import { prisma } from '@/libs/prisma';

export class CreateOrderRepository implements ICreateOrder {
    async createOrder(data: CreateOrderData): Promise<any> {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear el Pedido
            const order = await tx.pedido.create({
                data: {
                    restaurantId: data.restaurantId,
                    sucursalId: data.sucursalId ?? null,
                    clienteId: data.clienteId ?? null,
                    nombreCliente: data.nombreCliente ?? null,
                    total: data.total,
                    estado: data.estado ?? 'Pendiente',
                    mesaId: data.mesaId,
                    empleadoId: data.empleadoId ?? null,
                },
            });

            // 2. Crear los Items del Pedido
            await tx.itemPedido.createMany({
                data: data.items.map((item) => ({
                    pedidoId: order.id,
                    platoId: item.platoId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    nota: item.nota ?? '',
                })),
            });

            // 3. Actualizar estado de la mesa a Ocupada
            await tx.mesa.update({
                where: { id: data.mesaId },
                data: { estado: 'Ocupada' },
            });

            return order;
        });

        return result;
    }
}
