import { prisma } from "@/libs/prisma";
import { IPlanPaymentRepository, IPlanPayment } from "@/interfaces/User/Business/PlanPayment/IPlanPaymentRepository";

export class PlanPaymentRepository implements IPlanPaymentRepository {
    async findByUserId(userId: string): Promise<IPlanPayment[]> {
        const restaurant = await prisma.restaurant.findUnique({
            where: { userId },
        });

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return await prisma.planPayment.findMany({
            where: {
                restaurantId: restaurant.id,
            },
            include: {
                plan: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }) as IPlanPayment[];
    }
}
