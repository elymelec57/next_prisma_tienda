import { prisma } from "@/libs/prisma";
import { ISubscription, Subscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class SubscriptionRepository implements ISubscription {
    async create(data: Subscription) {
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

    async update(id: number, data: any) {
        return await prisma.subscription.update({
            where: { id: Number(id) },
            data: {
                status: data.status,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined
            }
        });
    }

    async delete(id: number) {
        return await prisma.subscription.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.subscription.findUnique({
            where: { id: Number(id) },
            include: {
                restaurant: true,
                plan: true
            }
        });
    }
}
