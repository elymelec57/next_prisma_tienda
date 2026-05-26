import { prisma } from "@/libs/prisma";
import { IRestaurant, Restaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class RestaurantRepository implements IRestaurant {
    async create(data: Restaurant) {
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

    async update(id: number, data: Restaurant) {
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

    async delete(id: number) {
        return await prisma.restaurant.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            include: {
                categoriaRestaurant: true,
                paymentMethods: true
            }
        });
    }
}
