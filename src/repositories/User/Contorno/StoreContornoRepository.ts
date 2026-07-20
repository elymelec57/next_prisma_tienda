import { prisma } from '@/libs/prisma';
import { IStoreContorno } from '@/interfaces/User/Contornos/StoreContornoInterface';

export class StoreContornoRepository implements IStoreContorno {
    async RestaurantByUserId(userId) {
        return await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: {
                id: true,
            },
        });
    }

    async create(data) {
        return await prisma.contornos.create({
            data: {
                nombre: data.nombre,
                price: Number(data.price),
                restaurant: {
                    connect: {
                        id: Number(data.restaurantId),
                    },
                },
            },
        });
    }

    async createContornoSucursal(data) {
        return await prisma.contornos.create({
            data: {
                nombre: data.nombre,
                price: Number(data.price),
                restaurant: {
                    connect: {
                        id: Number(data.restaurantId),
                    },
                },
                sucursal: {
                    connect: {
                        id: Number(data.sucursalId),
                    },
                },
            },
        });
    }
}
