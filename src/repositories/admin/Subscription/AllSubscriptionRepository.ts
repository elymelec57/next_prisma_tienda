import { prisma } from "@/libs/prisma";
import { IAllSubscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class AllSubscriptionRepository implements IAllSubscription {
    async all(): Promise<any[]> {
        return await prisma.subscription.findMany({
            include: {
                restaurant: true,
                plan: true
            }
        });
    }
}
