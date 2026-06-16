import { IFindOrderById } from "@/interfaces/User/Order/FindOrderByIdInterface";
import { prisma } from "@/libs/prisma";

export class FindOrderByIdRepository implements IFindOrderById {
    async findOrderById(id: number): Promise<any> {
        const order = await prisma.pedido.findUnique({
            where: { id },
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
        return order;
    }
}
