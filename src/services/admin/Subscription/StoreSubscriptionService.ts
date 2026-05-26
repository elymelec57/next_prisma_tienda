import { ISubscription, Subscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class StoreSubscriptionService {
    constructor(private repository: ISubscription) {}

    async execute(data: Subscription) {
        return await this.repository.create(data);
    }
}
