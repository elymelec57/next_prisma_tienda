import { IAllSubscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class AllSubscriptionService {
    constructor(private repository: IAllSubscription) {}

    async execute() {
        return await this.repository.all();
    }
}
