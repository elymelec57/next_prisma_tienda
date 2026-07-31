import { prisma } from '@/libs/prisma';
import { IPlato } from '@/interfaces/User/Platos/PlatoInterface';

export class PlatoRepository implements IPlato {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.plato.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                disponible: true,
                mainImageId: true,
                categoriaId: true,
                sucursales: true,
            },
            where: {
                restaurantId: restaurantId,
                sucursales: { none: {} }
            },
        });
    }

    async findAllByRestaurantIdAndSucursalId(restaurantId, sucursalId) {
        return await prisma.plato.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                disponible: true,
                mainImageId: true,
                categoriaId: true,
                sucursales: true,
            },
            where: {
                restaurantId: restaurantId,
                sucursales: {
                    some: {
                        id: Number(sucursalId)
                    }
                }
            },
        });
    }

    async findImagesByIds(imageIds) {
        return await prisma.image.findMany({
            where: {
                id: {
                    in: imageIds,
                },
                modelType: 'platos',
            },
            select: {
                id: true,
                url: true,
            },
        });
    }

    async findImageById(id) {
        return await prisma.image.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                url: true
            }
        });
    }
}
