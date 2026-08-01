export interface IPlanPayment {
    id: number;
    restaurantId: number;
    planId: number;
    amount: number;
    paymentMethod: string;
    transactionId?: string | null;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    plan?: {
        id: number;
        name: string;
        price: number;
        description?: string | null;
    };
}

export interface IFindPlanPaymentsByRestaurantData {
    userId: string;
}

export interface IPlanPaymentRepository {
    findByUserId(userId: string): Promise<IPlanPayment[]>;
}
