import { IAllOrderOnline } from "@/interfaces/User/Order/AllOrderOnlineInterface";
import { prisma } from "@/libs/prisma";

export class AllOrderOnlineRepository implements IAllOrderOnline {
    async allOrderOnline(id: number): Promise<any> {
        const orders = await prisma.pedido.findMany({
            where: {
                restaurantId: id
            },
            include: {
                cliente: true,
                Payment: true,
                mesa: true,
                restaurant: {
                    select: {
                        currency: true
                    }
                }
            }
        });
        return orders;
    }
}