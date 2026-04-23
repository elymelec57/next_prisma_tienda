import { prisma } from '@/libs/prisma';

export class PlanPaymentRepository {
    async findAll() {
        return await prisma.planPayment.findMany({
            include: {
                restaurant: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        subscription: {
                            include: {
                                plan: true
                            }
                        }
                    }
                },
                plan: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id) {
        return await prisma.planPayment.findUnique({
            where: { id: Number(id) },
            include: { plan: true }
        });
    }

    async updateStatus(id, status) {
        return await prisma.planPayment.update({
            where: { id: Number(id) },
            data: { status }
        });
    }

    async upsertSubscription(data) {
        return await prisma.subscription.upsert({
            where: { restaurantId: data.restaurantId },
            update: {
                planId: data.planId,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status
            },
            create: {
                restaurantId: data.restaurantId,
                planId: data.planId,
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status
            }
        });
    }
}
