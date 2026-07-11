import { prisma } from '@/libs/prisma';
import { IGetIngredient } from '@/interfaces/User/Ingredient/GetIngredientInterface';

export class IngredientRepository implements IGetIngredient {
    async findAllByRestaurantId(restaurantId: number, sucursalId: number | null) {
        let whereClause: any = { restaurantId: Number(restaurantId) };

        if (sucursalId) {
            whereClause.sucursalId = Number(sucursalId);
        } else {
            whereClause.sucursalId = null;
        }

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

    async getCurrency(id) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            select: { currency: true }
        });
        return restaurant?.currency || 'USD';
    }
}
