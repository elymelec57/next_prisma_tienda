import { prisma } from '@/libs/prisma';
import { IGetEmployeesRepository } from '@/interfaces/User/Employees/GetEmployeesInterface';

export class EmployeeRepository implements IGetEmployeesRepository {
    async findRestaurantByUserId(id: number) {
        return await prisma.empleado.findMany({
            where: { restaurantId: Number(id) },
            include: {
                rol: true,
            },
            orderBy: { nombre: 'asc' }
        });
    }
}
