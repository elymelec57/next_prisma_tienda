import { prisma } from "@/libs/prisma";
import {
    ISubscriptionRepository,
    ISubscription,
    IPlan,
    ISubscribeData,
} from "@/interfaces/User/Business/Subscription/ISubscriptionRepository";

export class SubscriptionRepository implements ISubscriptionRepository {
    async findByUserId(userId: number): Promise<{ subscription: ISubscription | null; availablePlans: IPlan[] }> {
        const restaurant = await prisma.restaurant.findUnique({
            where: { userId },
            include: {
                subscription: {
                    include: {
                        plan: true,
                    },
                },
            },
        });

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const plans = await prisma.plan.findMany();

        return {
            subscription: restaurant.subscription as ISubscription | null,
            availablePlans: plans as IPlan[],
        };
    }

    async subscribe(data: ISubscribeData): Promise<{ subscription?: ISubscription; payment?: object; message?: string }> {
        const { userId, planId, paymentMethod, transactionId, newImage } = data;

        const restaurant = await prisma.restaurant.findUnique({
            where: { userId },
        });

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const plan = await prisma.plan.findUnique({
            where: { id: Number(planId) },
        });

        if (!plan) {
            throw new Error("Plan not found");
        }

        const image = await prisma.image.create({
            data: {
                url: newImage.pathname,
                modelId: 'Por_definir',
                modelType: 'planPayment',
                altText: 'Imagen de pago de plan',
            },
        });

        // If plan is free, activate immediately
        if (plan.price === 0) {
            const subscription = await prisma.subscription.upsert({
                where: { restaurantId: restaurant.id },
                update: {
                    planId: plan.id,
                    status: 'active',
                    startDate: new Date(),
                },
                create: {
                    restaurantId: restaurant.id,
                    planId: plan.id,
                    status: 'active',
                    startDate: new Date(),
                },
            });
            return { subscription: subscription as ISubscription };
        }

        // If plan is paid, create a pending payment for admin confirmation
        const payment = await prisma.planPayment.create({
            data: {
                restaurantId: restaurant.id,
                planId: plan.id,
                amount: plan.price,
                paymentMethod: paymentMethod ?? 'unknown',
                transactionId,
                status: 'PENDING',
                mainImageId: image.id
            },
        });

        await prisma.image.update({
            where: { id: image.id },
            data: { modelId: String(payment.id) }
        });

        return {
            payment,
            message: 'Pago registrado, esperando confirmación del administrador.',
        };
    }
}
