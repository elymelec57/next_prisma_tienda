import { prisma } from '@/libs/prisma';

export class RestaurantRepository {
    async findByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: {
                id: true,
                currency: true,
                subscription: {
                    include: {
                        plan: true
                    }
                },
                _count: {
                    select: {
                        platos: true
                    }
                }
            },
        });
    }

    async findIdByUserId(userId) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: { id: true },
        });
        return restaurant?.id || null;
    }

    async getCurrency(id) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            select: { currency: true }
        });
        return restaurant?.currency || 'USD';
    }
}
