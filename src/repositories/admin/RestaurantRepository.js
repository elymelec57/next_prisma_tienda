import { prisma } from '@/libs/prisma';

export class RestaurantRepository {
    async findAll() {
        return await prisma.restaurant.findMany();
    }

    async findById(id) {
        return await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            include: {
                categoriaRestaurant: true,
                paymentMethods: true
            }
        });
    }

    async create(data) {
        return await prisma.restaurant.create({
            data: {
                slug: data.slug,
                name: data.name,
                slogan: data.slogan,
                phone: data.phone,
                direcction: data.direcction,
                user: {
                    connect: {
                        id: Number(data.userId)
                    }
                },
                categoriaRestaurant: {
                    connect: data.categoriaRestaurant ? data.categoriaRestaurant.map(id => ({ id: Number(id) })) : []
                },
                paymentMethods: {
                    connect: data.paymentMethods ? data.paymentMethods.map(id => ({ id: id })) : []
                }
            }
        });
    }

    async update(id, data) {
        return await prisma.restaurant.update({
            where: { id: Number(id) },
            data: {
                slug: data.slug,
                name: data.name,
                slogan: data.slogan,
                phone: data.phone,
                direcction: data.direcction
            }
        });
    }

    async delete(id) {
        return await prisma.restaurant.delete({
            where: { id: Number(id) }
        });
    }
}
