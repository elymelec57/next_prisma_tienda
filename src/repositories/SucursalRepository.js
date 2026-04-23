import { prisma } from '@/libs/prisma';

export class SucursalRepository {
    async findAllByRestaurantId(restaurantId) {
        return await prisma.sucursal.findMany({
            where: { restaurantId: Number(restaurantId) },
            include: {
                _count: {
                    select: {
                        platos: true,
                        mesas: true,
                        empleados: true
                    }
                }
            }
        });
    }

    async findById(id) {
        return await prisma.sucursal.findUnique({
            where: { id: Number(id) },
            include: {
                restaurant: true,
                platos: true
            }
        });
    }

    async create(data) {
        return await prisma.sucursal.create({
            data: {
                nombre: data.nombre,
                direccion: data.direccion,
                telefono: data.telefono,
                lat: data.lat ? parseFloat(data.lat) : null,
                lng: data.lng ? parseFloat(data.lng) : null,
                restaurant: {
                    connect: { id: Number(data.restaurantId) }
                },
                platos: {
                    connect: data.platos ? data.platos.map(id => ({ id: Number(id) })) : []
                }
            }
        });
    }

    async update(id, data) {
        return await prisma.sucursal.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre,
                direccion: data.direccion,
                telefono: data.telefono,
                lat: data.lat ? parseFloat(data.lat) : null,
                lng: data.lng ? parseFloat(data.lng) : null,
                platos: {
                    set: data.platos ? data.platos.map(id => ({ id: Number(id) })) : []
                }
            }
        });
    }

    async delete(id) {
        return await prisma.sucursal.delete({
            where: { id: Number(id) }
        });
    }
}
