import { prisma } from '@/libs/prisma';

export class ContornoRepository {
    async findAll() {
        return await prisma.contornos.findMany();
    }

    async findById(id) {
        return await prisma.contornos.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.contornos.create({
            data: {
                nombre: data.nombre,
                price: data.price,
                restaurant: {
                    connect: {
                        id: Number(data.restaurantId)
                    }
                }
            }
        });
    }

    async update(id, data) {
        return await prisma.contornos.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre,
                price: data.price
            }
        });
    }

    async delete(id) {
        return await prisma.contornos.delete({
            where: { id: Number(id) }
        });
    }
}
