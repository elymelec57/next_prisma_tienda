import { prisma } from '@/libs/prisma';

export class EmployeeRepository {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.empleado.findMany({
            where: { restaurantId: Number(restaurantId) },
            include: {
                rol: true,
            },
            orderBy: { nombre: 'asc' }
        });
    }
}
