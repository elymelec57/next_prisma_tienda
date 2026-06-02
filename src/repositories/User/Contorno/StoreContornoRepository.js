import { prisma } from '@/libs/prisma';

export class StoreContornoRepository {
    async RestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: {
                id: true,
            },
        });
    }

    async create(data) {
        return await prisma.contornos.create({
            data: {
                nombre: data.nombre,
                price: Number(data.price),
                restaurant: {
                    connect: {
                        id: Number(data.restaurantId),
                    },
                },
            },
        });
    }
}
