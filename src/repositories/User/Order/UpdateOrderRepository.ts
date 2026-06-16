import { IUpdateOrder, UpdateOrderData } from "@/interfaces/User/Order/UpdateOrderInterface";
import { prisma } from "@/libs/prisma";

export class UpdateOrderRepository implements IUpdateOrder {
    async updateOrder(id: number, data: UpdateOrderData): Promise<any> {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el Pedido
            const order = await tx.pedido.update({
                where: { id },
                data: {
                    total: parseFloat(String(data.total)),
                    nombreCliente: data.nombreCliente || null,
                }
            });

            // 2. Eliminar items anteriores
            await tx.itemPedido.deleteMany({
                where: { pedidoId: id }
            });

            // 3. Crear los nuevos items
            const orderItemsEntries = data.items.map((item) => ({
                pedidoId: order.id,
                platoId: Number(item.platoId),
                cantidad: Number(item.cantidad),
                precioUnitario: parseFloat(String(item.precioUnitario)),
                nota: item.nota || ""
            }));

            await tx.itemPedido.createMany({
                data: orderItemsEntries
            });

            return order;
        });

        return result;
    }
}
