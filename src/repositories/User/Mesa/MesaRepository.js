import { prisma } from '@/libs/prisma';

export class MesaRepository {
    async findRestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) }
        });
    }

    async findAllByRestaurantId(restaurantId) {
        return await prisma.mesa.findMany({
            where: { restaurantId: Number(restaurantId) },
            include: {
                pedidos: {
                    where: {
                        estado: {
                            notIn: ['Pagado', 'Cancelado']
                       }
                    },
                    include: {
                        items: {
                            include: {
                                plato: true
                            }
                        }
                    }
                },
                restaurant: {
                    select: {
                        currency: true
                    }
                }
            }
        });
    }
}
