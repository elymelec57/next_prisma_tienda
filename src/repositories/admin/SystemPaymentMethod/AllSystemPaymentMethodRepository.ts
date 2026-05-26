import { prisma } from "@/libs/prisma";
import { IAllSystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class AllSystemPaymentMethodRepository implements IAllSystemPaymentMethod {
    async all(): Promise<any[]> {
        return await prisma.paymentMethod.findMany({
            where: {
                restaurantId: null
            }
        });
    }
}
