import { prisma } from '@/libs/prisma';
import { IStorePlato } from '@/interfaces/User/Platos/StorePlatoInterface';
export class StorePlatoRepository implements IStorePlato {
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
                    connect: data.sucursales !== 'main' ? [{ id: Number(data.sucursales) }] : undefined
                },
                mainImageId: data.mainImageId,
            },
            include: {
                restaurant: true,
                categoria: true,
            },
        });
    }

    async createImage(data) {
        return await prisma.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            },
        });
    }

    async updateImage(id: string, modelId: string) {
        return await prisma.image.update({
            where: { id },
            data: { modelId }
        });
    }
}
