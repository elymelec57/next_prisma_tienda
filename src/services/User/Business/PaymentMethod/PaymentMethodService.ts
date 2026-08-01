import {
    IPaymentMethodRepository,
    ICreatePaymentMethodData,
    IUpdatePaymentMethodData,
    IPaymentMethod
} from "@/interfaces/User/Business/PaymentMethod/IPaymentMethodRepository";

export class PaymentMethodService {
    constructor(private readonly paymentMethodRepository: IPaymentMethodRepository) { }

    async getPaymentMethodsByRestaurant(restaurantId: number | string): Promise<IPaymentMethod[]> {
        return await this.paymentMethodRepository.findAllByRestaurantId(restaurantId);
    }

    async createPaymentMethod(restaurantId: number, paymentMethod: Omit<ICreatePaymentMethodData, 'restaurantId'>): Promise<IPaymentMethod> {
        if (!restaurantId || !paymentMethod) {
            throw new Error("Missing data: restaurantId and paymentMethod are required");
        }
        return await this.paymentMethodRepository.create({
            ...paymentMethod,
            restaurantId,
        });
    }

    async updatePaymentMethod(id: string, data: IUpdatePaymentMethodData): Promise<IPaymentMethod> {
        return await this.paymentMethodRepository.update(id, data);
    }

    async deletePaymentMethod(id: string): Promise<IPaymentMethod> {
        return await this.paymentMethodRepository.delete(id);
    }
}
