import { prisma } from "@/libs/prisma";
import { IAllPlanPayment } from "@/interfaces/admin/PlanPayment/PlanPaymentInterface";

export class AllPlanPaymentRepository implements IAllPlanPayment {
    async all(): Promise<any[]> {
        return await prisma.planPayment.findMany({
            include: {
                plan: true,
                restaurant: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
