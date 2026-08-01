import {
    ISubscriptionRepository,
    ISubscription,
    IPlan,
} from "@/interfaces/User/Business/Subscription/ISubscriptionRepository";

export class SubscriptionService {
    constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

    async getSubscriptionData(userId: string): Promise<{ subscription: ISubscription | null; availablePlans: IPlan[] }> {
        if (!userId) {
            throw new Error("userId is required");
        }
        return await this.subscriptionRepository.findByUserId(userId);
    }

    async subscribe(
        userId: string,
        planId: number,
        paymentMethod?: string,
        transactionId?: string
    ): Promise<{ subscription?: ISubscription; payment?: object; message?: string }> {
        if (!userId || !planId) {
            throw new Error("userId and planId are required");
        }
        return await this.subscriptionRepository.subscribe({ userId, planId, paymentMethod, transactionId });
    }
}
