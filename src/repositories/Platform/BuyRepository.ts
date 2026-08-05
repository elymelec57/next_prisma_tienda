import { prisma } from "@/libs/prisma";
import { IBuy } from "@/interfaces/Platform/BuyInterface";

export class BuyRepository implements IBuy {
    async findRestaurantBySlug(slug: string) {
        return await prisma.restaurant.findFirst({
            where: { slug }
        })
    }

    async findPedidoByIdPotencia(idpotencia: string, restaurantId: number) {
        return await prisma.pedido.findFirst({
            where: { idpotencia, restaurantId },
            include: { Payment: true }
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

    async createImage(data: any) {
        return await prisma.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            },
        });
    }

    async updateImage(id: string, modelId: string) {
        return await prisma.image.update({
            where: { id },
            data: { modelId }
        });
    }

    async createPayment(input: any) {
        return await prisma.payment.create(input)
    }

    async createItemPedido(input: any) {
        return await prisma.itemPedido.create(input)
    }
}