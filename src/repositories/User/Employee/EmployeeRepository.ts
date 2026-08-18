import { prisma } from '@/libs/prisma';
import { IGetEmployeesRepository } from '@/interfaces/User/Employees/GetEmployeesInterface';

export class EmployeeRepository implements IGetEmployeesRepository {
    async findRestaurantByUserId(id: number, sucursalId: number | string) {
        return await prisma.empleado.findMany({
            where: {
                restaurantId: Number(id),
                sucursalId: sucursalId === 'main' ? null : Number(sucursalId)
            },
            include: {
                rol: true,
            },
            orderBy: { nombre: 'asc' }
        });
    }

    async getAllRoles(): Promise<any> {
        return await prisma.rol.findMany();
    }
}
