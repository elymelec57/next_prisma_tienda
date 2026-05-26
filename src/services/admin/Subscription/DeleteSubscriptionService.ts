import { ISubscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class DeleteSubscriptionService {
    constructor(private repository: ISubscription) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
