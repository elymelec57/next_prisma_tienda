import { prisma } from '@/libs/prisma';

export class StoreEmployeeRepository {
    async create(data) {
        return await prisma.empleado.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                email: data.email,
                password: data.password,
                rolId: Number(data.rolId),
                userId: Number(data.userId),
                restaurantId: Number(data.restaurantId),
            },
            include: {
                rol: true
            }
        });
    }
}
