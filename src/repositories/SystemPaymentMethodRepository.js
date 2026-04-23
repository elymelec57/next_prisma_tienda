import { prisma } from '@/libs/prisma';

export class SystemPaymentMethodRepository {
    async findAll() {
        return await prisma.paymentMethod.findMany({
            where: {
                restaurantId: null
            }
        });
    }

    async findById(id) {
        return await prisma.paymentMethod.findUnique({
            where: { id: id } // UUID
        });
    }

    async create(data) {
        return await prisma.paymentMethod.create({
            data: {
                type: data.type,
                label: data.label,
                ownerName: data.ownerName,
                ownerId: data.ownerId,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                phoneNumber: data.phoneNumber,
                email: data.email,
                isActive: data.isActive !== undefined ? data.isActive : true,
                restaurantId: null // Ensure it's a system-wide method
            }
        });
    }

    async update(id, data) {
        return await prisma.paymentMethod.update({
            where: { id: id },
            data: {
                type: data.type,
                label: data.label,
                ownerName: data.ownerName,
                ownerId: data.ownerId,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                phoneNumber: data.phoneNumber,
                email: data.email,
                isActive: data.isActive,
                restaurantId: null // Keep as system-wide
            }
        });
    }

    async delete(id) {
        return await prisma.paymentMethod.delete({
            where: { id: id }
        });
    }
}
