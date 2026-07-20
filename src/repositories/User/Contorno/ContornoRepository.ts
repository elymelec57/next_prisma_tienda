import { prisma } from '@/libs/prisma';
import { IAllContornos } from '@/interfaces/User/Contornos/AllContornosInterface';

export class ContornoRepository implements IAllContornos {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.contornos.findMany({
            select: {
                id: true,
                nombre: true,
                price: true,
            },
            where: {
                restaurantId: Number(restaurantId),
                sucursalId: null
            },
        });
    }

    async findAllByRestaurantIdAndSucursalId(restaurantId, sucursalId) {
        return await prisma.contornos.findMany({
            select: {
                id: true,
                nombre: true,
                price: true,
            },
            where: {
                restaurantId: Number(restaurantId),
                sucursalId: Number(sucursalId)
            },
        });
    }

    async findById(id) {
        return await prisma.contornos.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                nombre: true,
                price: true,
                restaurantId: true,
            }
        });
    }
}
