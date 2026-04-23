import { prisma } from '@/libs/prisma';

export class PlanRepository {
    async findAll() {
        return await prisma.plan.findMany();
    }

    async findById(id) {
        return await prisma.plan.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.plan.create({
            data: {
                name: data.name,
                price: Number(data.price),
                productLimit: Number(data.productLimit),
                description: data.description,
            }
        });
    }

    async update(id, data) {
        return await prisma.plan.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                price: Number(data.price),
                productLimit: Number(data.productLimit),
                description: data.description,
            }
        });
    }

    async delete(id) {
        return await prisma.plan.delete({
            where: { id: Number(id) }
        });
    }
}
