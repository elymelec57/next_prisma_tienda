import {
    ISubscriptionRepository,
    ISubscription,
    IPlan,
} from "@/interfaces/User/Business/Subscription/ISubscriptionRepository";
import { SaveImageInterface } from "@/interfaces/Shared/File/SaveImageInterface";

export class StoreSubscriptionService {
    constructor(
        private readonly subscriptionRepository: ISubscriptionRepository,
        private readonly saveImage: SaveImageInterface
    ) { }

    async execute(
        userId: number,
        planId: number,
        paymentMethod?: string,
        transactionId?: string,
        image?: File,
        idpotencia?: string
    ): Promise<{ subscription?: ISubscription; payment?: object; message?: string }> {
        if (!userId || !planId || !image) {
            throw new Error("userId and planId are required");
        }

        const newImage = await this.saveImage.saveImage('planPayment', image);
        if (!newImage) {
            throw new Error("Image not uploaded");
        }

        return await this.subscriptionRepository.subscribe({ userId, planId, paymentMethod, transactionId, idpotencia, newImage });
    }
}
