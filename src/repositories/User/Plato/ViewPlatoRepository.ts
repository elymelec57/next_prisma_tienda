import { prisma } from '@/libs/prisma';
import { IViewPlato } from '@/interfaces/User/Platos/ViewPlatoInterface';

export class ViewPlatoRepository implements IViewPlato {

    async AllContornos(restaurantId) {
        return await prisma.contornos.findMany({
            select: {
                id: true,
                nombre: true,
                price: true,
            },
            where: {
                restaurantId: restaurantId
            }
        });
    }

    async AllContornosSucursalId(restaurantId, sucursalId) {
        return await prisma.contornos.findMany({
            select: {
                id: true,
                nombre: true,
                price: true,
            },
            where: {
                restaurantId: restaurantId,
                sucursalId: Number(sucursalId)
            }
        });
    }

    async findCategoriesByRestaurantId(restaurantId) {
        return await prisma.categoria.findMany({
            where: {
                platos: {
                    some: {
                        restaurantId: restaurantId
                    }
                }
            }
        });
    }
}
