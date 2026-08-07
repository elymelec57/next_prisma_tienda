import { ICreateOrder, CreateOrderData } from '@/interfaces/User/Order/CreateOrderInterface';
import { prisma } from '@/libs/prisma';
import { getNextOrderCode } from '@/libs/orderCode';

export class CreateOrderRepository implements ICreateOrder {
    async createOrder(data: CreateOrderData): Promise<any> {
        const result = await prisma.$transaction(async (tx) => {
            // 0. Idempotencia: si ya existe un pedido con este idpotencia, no duplicar
            if (data.idpotencia) {
                const existing = await tx.pedido.findFirst({
                    where: { idpotencia: data.idpotencia, restaurantId: data.restaurantId },
                    include: { items: true },
                });

                if (existing) {
                    return { ...existing, _idempotent: true };
                }
            }

            // 1. Generar el codigo y crear el Pedido
            const codigo = await getNextOrderCode(tx, data.restaurantId, data.sucursalId ?? null);
            const order = await tx.pedido.create({
                data: {
                    codigo,
                    restaurantId: data.restaurantId,
                    sucursalId: data.sucursalId ?? null,
                    clienteId: data.clienteId ?? null,
                    nombreCliente: data.nombreCliente ?? null,
                    total: data.total,
                    estado: data.estado ?? 'Pendiente',
                    mesaId: data.mesaId,
                    empleadoId: data.empleadoId ?? null,
                    idpotencia: data.idpotencia ?? null,
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
