import { prisma } from '@/libs/prisma';

export class ContornoRepository {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.contornos.findMany({
            select: {
                id: true,
                nombre: true,
                price: true,
            },
            where: {
                restaurantId: Number(restaurantId)
            },
        });
    }

    async findById(id) {
        return await prisma.contornos.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                nombre: true,
                price: true,
                restaurantId: true,
            }
        });
    }
}
