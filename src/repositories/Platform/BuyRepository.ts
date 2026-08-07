import { prisma } from "@/libs/prisma";
import { IBuy } from "@/interfaces/Platform/BuyInterface";

export class BuyRepository implements IBuy {
    async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
        return await prisma.$transaction(fn);
    }

    async findRestaurantBySlug(slug: string, tx: any = prisma) {
        return await tx.restaurant.findFirst({
            where: { slug }
        })
    }

    async findPedidoByIdPotencia(idpotencia: string, restaurantId: number, tx: any = prisma) {
        return await tx.pedido.findFirst({
            where: { idpotencia, restaurantId },
            include: { Payment: true }
        })
    }

    async findClient(conditions: any, tx: any = prisma) {
        return await tx.cliente.findFirst({
            where: {
                OR: conditions
            }
        })
    }

    async createClient(input: any, tx: any = prisma) {
        return await tx.cliente.create(input)
    }

    async updateClient(id: number, data: any, tx: any = prisma) {
        return await tx.cliente.update({
            where: { id },
            data
        })
    }

    async createPedido(input: any, tx: any = prisma) {
        return await tx.pedido.create(input)
    }

    async createImage(data: any, tx: any = prisma) {
        return await tx.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            },
        });
    }

    async updateImage(id: string, modelId: string, tx: any = prisma) {
        return await tx.image.update({
            where: { id },
            data: { modelId }
        });
    }

    async createPayment(input: any, tx: any = prisma) {
        return await tx.payment.create(input)
    }

    async createItemPedido(input: any, tx: any = prisma) {
        return await tx.itemPedido.create(input)
    }
}