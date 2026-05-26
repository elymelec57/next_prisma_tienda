import { prisma } from "@/libs/prisma";
import { IPlanPayment } from "@/interfaces/admin/PlanPayment/PlanPaymentInterface";

export class PlanPaymentRepository implements IPlanPayment {
    async findById(id: number) {
        return await prisma.planPayment.findUnique({
            where: { id: Number(id) },
            include: {
                plan: true,
                restaurant: true
            }
        });
    }

    async update(id: number, data: any) {
        return await prisma.planPayment.update({
            where: { id: Number(id) },
            data: data
        });
    }

    async createSubscription(data: any) {
        return await prisma.subscription.create({
            data: data
        });
    }
}
