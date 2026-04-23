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
                restaurant: {
                    connect: { id: Number(data.restaurantId) }
                },
                plan: {
                    connect: { id: Number(data.planId) }
                },
                startDate: data.startDate ? new Date(data.startDate) : new Date(),
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: data.status || "active"
            }
        });
    }

    async update(id, data) {
        return await prisma.subscription.update({
            where: { id: Number(id) },
            data: {
                planId: data.planId ? Number(data.planId) : undefined,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                status: data.status
            }
        });
    }

    async delete(id) {
        return await prisma.subscription.delete({
            where: { id: Number(id) }
        });
    }
}
