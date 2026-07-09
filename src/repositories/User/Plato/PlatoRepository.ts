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
                restaurantId: restaurantId
            },
        });
    }

    // async AllContornos(restaurantId) {
    //     return await prisma.contornos.findMany({
    //         select: {
    //             id: true,
    //             nombre: true,
    //             price: true,
    //         },
    //         where: {
    //             restaurantId: restaurantId
    //         }
    //     });
    // }

    // async Allsucursales(restaurantId) {
    //     return await prisma.sucursal.findMany({
    //         where: { restaurantId: Number(restaurantId) },
    //         select: {
    //             id: true,
    //             nombre: true,
    //         }
    //     });
    // }

    async findImagesByIds(imageIds) {
        return await prisma.image.findMany({
            where: {
                id: {
                    in: imageIds,
                },
                modelType: 'plato',
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

    // async findCategoriesByRestaurantId(restaurantId) {
    //     return await prisma.categoria.findMany({
    //         where: {
    //             platos: {
    //                 some: {
    //                     restaurantId: restaurantId
    //                 }
    //             }
    //         }
    //     });
    // }
}
