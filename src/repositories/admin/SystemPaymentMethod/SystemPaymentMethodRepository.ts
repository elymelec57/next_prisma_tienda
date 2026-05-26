import { prisma } from "@/libs/prisma";
import { ISystemPaymentMethod, SystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class SystemPaymentMethodRepository implements ISystemPaymentMethod {
    async create(data: SystemPaymentMethod) {
        return await prisma.paymentMethod.create({
            data: {
                type: data.type,
                active: data.active,
                config: data.config,
                restaurantId: data.restaurantId || null
            }
        });
    }

    async update(id: string, data: SystemPaymentMethod) {
        return await prisma.paymentMethod.update({
            where: { id: id },
            data: {
                type: data.type,
                active: data.active,
                config: data.config,
                restaurantId: data.restaurantId || null
            }
        });
    }

    async delete(id: string) {
        return await prisma.paymentMethod.delete({
            where: { id: id }
        });
    }

    async findById(id: string) {
        return await prisma.paymentMethod.findUnique({
            where: { id: id }
        });
    }
}
