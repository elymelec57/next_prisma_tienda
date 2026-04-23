import { prisma } from '@/libs/prisma';

export class CategoriaRestaurantRepository {
    async findAll() {
        return await prisma.categoriaRestaurant.findMany();
    }

    async findById(id) {
        return await prisma.categoriaRestaurant.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.categoriaRestaurant.create({
            data: {
                nombre: data.nombre
            }
        });
    }

    async update(id, data) {
        return await prisma.categoriaRestaurant.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id) {
        return await prisma.categoriaRestaurant.delete({
            where: { id: Number(id) }
        });
    }
}
