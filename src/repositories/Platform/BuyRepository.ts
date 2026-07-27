import { prisma } from "@/libs/prisma";
import { IBuy } from "@/interfaces/Platform/BuyInterface";

export class BuyRepository implements IBuy {
    async findRestaurantBySlug(slug: string) {
        return await prisma.restaurant.findFirst({
            where: { slug }
        })
    }

    async findClient(conditions: any) {
        return await prisma.cliente.findFirst({
            where: {
                OR: conditions
            }
        })
    }

    async createClient(input: any) {
        return await prisma.cliente.create(input)
    }

    async updateClient(id: number, data: any) {
        return await prisma.cliente.update({
            where: { id },
            data
        })
    }

    async createPedido(input: any) {
        return await prisma.pedido.create(input)
    }

    async createPayment(input: any) {
        return await prisma.payment.create(input)
    }

    async createItemPedido(input: any) {
        return await prisma.itemPedido.create(input)
    }
}