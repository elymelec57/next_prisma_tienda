import { prisma } from '@/libs/prisma';

export class ClientRepository {
    async findRestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: {
                userId: Number(userId)
            },
            include: {
                cliente: true
            }
        });
    }
}
