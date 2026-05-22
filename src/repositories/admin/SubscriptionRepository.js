import { prisma } from '@/libs/prisma';

export class SubscriptionRepository {
    async findAll() {
        return await prisma.subscription.findMany({
            include: {
                restaurant: true,
                plan: true
            }
        });
    }

    async findById(id) {
        return await prisma.subscription.findUnique({
            where: { id: Number(id) },
            include: {
                restaurant: true,
                plan: true
            }
        });
    }

    async create(data) {
        return await prisma.subscription.create({
            data: {
                restaurantId: Number(data.restaurantId),
                planId: Number(data.planId),
                status: data.status,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            }
        });
    }

    async update(id, data) {
        return await prisma.subscription.update({
            where: { id: Number(id) },
            data: {
                status: data.status,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined
            }
        });
    }

    async delete(id) {
        return await prisma.subscription.delete({
            where: { id: Number(id) }
        });
    }
}
