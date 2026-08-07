import { prisma } from '@/libs/prisma';
import { MesaInterface } from '@/interfaces/User/Mesa/MesaInterface';

export class MesaRepository implements MesaInterface {
    async findRestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) }
        });
    }

    async findAllByRestaurantId(restaurantId) {
        return await prisma.mesa.findMany({
            where: {
                restaurantId: Number(restaurantId),
                sucursalId: null
            },
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

    async findAllByRestaurantIdAndSucursalId(restaurantId, sucursalId) {
        return await prisma.mesa.findMany({
            where: {
                restaurantId: Number(restaurantId),
                sucursalId: Number(sucursalId)
            },
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
