import { ISubscription } from "@/interfaces/admin/Subscription/SubscriptionInterface";

export class UpdateSubscriptionService {
    constructor(private repository: ISubscription) {}

    async execute(id: number, data: any) {
        return await this.repository.update(id, data);
    }
}
