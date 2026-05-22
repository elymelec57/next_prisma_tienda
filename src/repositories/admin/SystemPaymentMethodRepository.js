import { prisma } from '@/libs/prisma';

export class SystemPaymentMethodRepository {
    async findAll() {
        return await prisma.systemPaymentMethod.findMany();
    }

    async findById(id) {
        return await prisma.systemPaymentMethod.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.systemPaymentMethod.create({
            data: {
                name: data.name,
                type: data.type,
                config: data.config
            }
        });
    }

    async update(id, data) {
        return await prisma.systemPaymentMethod.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                type: data.type,
                config: data.config
            }
        });
    }

    async delete(id) {
        return await prisma.systemPaymentMethod.delete({
            where: { id: Number(id) }
        });
    }
}
