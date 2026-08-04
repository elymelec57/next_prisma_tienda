import { prisma } from '@/libs/prisma';
import { IDataEmployee, IStoreEmployeeRepository } from '@/interfaces/User/Employees/StoreEmployeesInterface';

export class StoreEmployeeRepository implements IStoreEmployeeRepository {
    async create(data: IDataEmployee) {
        return await prisma.empleado.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                email: data.email,
                password: data.password,
                rol: { connect: { id: Number(data.rolId) } },
                user: { connect: { id: data.userId } },
                restaurant: { connect: { id: data.restaurantId } },
                sucursal: data.sucursalId && data.sucursalId !== 'main' ? {
                    connect: {
                        id: Number(data.sucursalId)
                    }
                } : undefined,
            },
            include: {
                rol: true
            }
        });
    }
}
