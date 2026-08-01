import { prisma } from "@/libs/prisma";
import {
    IPaymentMethodRepository,
    ICreatePaymentMethodData,
    IUpdatePaymentMethodData,
    IPaymentMethod
} from "@/interfaces/User/Business/PaymentMethod/IPaymentMethodRepository";

export class PaymentMethodRepository implements IPaymentMethodRepository {
    async findAllByRestaurantId(restaurantId: number | string): Promise<IPaymentMethod[]> {
        return await prisma.paymentMethod.findMany({
            where: { restaurantId: Number(restaurantId) },
            orderBy: { createdAt: 'desc' }
        }) as IPaymentMethod[];
    }

    async create(data: ICreatePaymentMethodData): Promise<IPaymentMethod> {
        return await prisma.paymentMethod.create({ data }) as IPaymentMethod;
    }

    async update(id: string, data: IUpdatePaymentMethodData): Promise<IPaymentMethod> {
        return await prisma.paymentMethod.update({
            where: { id },
            data
        }) as IPaymentMethod;
    }

    async delete(id: string): Promise<IPaymentMethod> {
        return await prisma.paymentMethod.delete({
            where: { id }
        }) as IPaymentMethod;
    }
}
