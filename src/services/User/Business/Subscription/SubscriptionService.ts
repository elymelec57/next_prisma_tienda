import {
    ISubscriptionRepository,
    ISubscription,
    IPlan,
} from "@/interfaces/User/Business/Subscription/ISubscriptionRepository";

export class SubscriptionService {
    constructor(private readonly subscriptionRepository: ISubscriptionRepository) { }

    async getSubscriptionData(userId: number): Promise<{ subscription: ISubscription | null; availablePlans: IPlan[] }> {
        if (!userId) {
            throw new Error("userId is required");
        }
        return await this.subscriptionRepository.findByUserId(userId);
    }
}
