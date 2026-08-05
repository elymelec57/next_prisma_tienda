export interface ISubscription {
    id: number;
    restaurantId: number;
    planId: number;
    status: string;
    startDate?: Date | null;
    endDate?: Date | null;
    plan?: {
        id: number;
        name: string;
        price: number;
        description?: string | null;
    };
}

export interface IPlan {
    id: number;
    name: string;
    price: number;
    description?: string | null;
}

export interface ISubscribeData {
    userId: number;
    planId: number;
    paymentMethod?: string;
    transactionId?: string;
    idpotencia?: string;
    newImage: any;
}

export interface ISubscriptionRepository {
    findByUserId(userId: number): Promise<{ subscription: ISubscription | null; availablePlans: IPlan[] }>;
    subscribe(data: ISubscribeData): Promise<{ subscription?: ISubscription; payment?: object; message?: string }>;
}
