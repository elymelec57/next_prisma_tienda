import { prisma } from '@/libs/prisma';
import { IViewPlato } from '@/interfaces/User/Platos/ViewPlatoInterface';

export class ViewPlatoRepository implements IViewPlato {

    async getCurrency(id: number) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            select: { currency: true }
        });
        return restaurant?.currency || 'USD';
    }

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

    async Allsucursales(restaurantId) {
        return await prisma.sucursal.findMany({
            where: { restaurantId: Number(restaurantId) },
            select: {
                id: true,
                nombre: true,
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
