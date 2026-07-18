import { prisma } from '@/libs/prisma';
import { IGetIngredient } from '@/interfaces/User/Ingredient/GetIngredientInterface';

export class IngredientRepository implements IGetIngredient {
    async findAllByRestaurantId(restaurantId: number, sucursalId: number | null) {
        let whereClause: any = { restaurantId: Number(restaurantId), sucursales: { none: {} } };

        return await prisma.ingredienteRestaurante.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllByRestaurantAndSucursalId(restaurantId: number, sucursalId: number) {
        let whereClause: any = { restaurantId: Number(restaurantId) };
        whereClause.sucursalId = Number(sucursalId);

        return await prisma.ingredienteRestaurante.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id) {
        return await prisma.ingredienteRestaurante.findUnique({
            where: {
                id: Number(id),
            },
        });
    }
}
