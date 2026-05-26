import { ISubscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class GetSubscriptionService {
    constructor(private repository: ISubscription) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
