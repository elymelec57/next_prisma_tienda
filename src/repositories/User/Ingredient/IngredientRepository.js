import { prisma } from '@/libs/prisma';

export class IngredientRepository {
    async findAllByRestaurantId(restaurantId, sucursalId = null) {
        const whereClause = { restaurantId: Number(restaurantId) };

        if (sucursalId && sucursalId !== 'null') {
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
}
