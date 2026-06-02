import { prisma } from '@/libs/prisma';

export class StorePlatoRepository {
    async RestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: {
                id: true,
                currency: true,
                subscription: {
                    include: {
                        plan: true
                    }
                },
                _count: {
                    select: {
                        platos: true
                    }
                }
            },
        });
    }

    async create(data) {
        return await prisma.plato.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                disponible: true,
                restaurant: {
                    connect: {
                        id: data.restaurantId,
                    },
                },
                categoria: {
                    connect: {
                        id: data.categoriaId,
                    }
                },
                contornos: {
                    connect: data.contornos ? data.contornos.map(id => ({ id: Number(id) })) : []
                },
                sucursales: {
                    connect: data.sucursales ? data.sucursales.map(id => ({ id: Number(id) })) : []
                }
            },
            include: {
                restaurant: true,
                categoria: true,
            },
        });
    }
}
