import { IUpdateOrderStatus } from "@/interfaces/User/Order/UpdateOrderStatusInterface";
import { prisma } from "@/libs/prisma";

export class UpdateOrderStatusRepository implements IUpdateOrderStatus {
    async updateOrderStatus(id: number, estado: string, mesaId?: number): Promise<any> {
        const result = await prisma.pedido.update({
            where: { id },
            data: { estado }
        });

        if (estado === 'Servido' && mesaId) {
            await prisma.mesa.update({
                where: { id: mesaId },
                data: { estado: 'Servir' }
            });
        }

        return result;
    }
}
