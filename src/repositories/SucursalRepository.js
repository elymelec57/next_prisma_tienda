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
                deliveryFreeRange: data.deliveryFreeRange ? parseFloat(data.deliveryFreeRange) : null,
                deliveryShortRange: data.deliveryShortRange ? parseFloat(data.deliveryShortRange) : null,
                deliveryShortPrice: data.deliveryShortPrice ? parseFloat(data.deliveryShortPrice) : null,
                deliveryMediumRange: data.deliveryMediumRange ? parseFloat(data.deliveryMediumRange) : null,
                deliveryMediumPrice: data.deliveryMediumPrice ? parseFloat(data.deliveryMediumPrice) : null,
                deliveryLongRange: data.deliveryLongRange ? parseFloat(data.deliveryLongRange) : null,
                deliveryLongPrice: data.deliveryLongPrice ? parseFloat(data.deliveryLongPrice) : null,
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
                deliveryFreeRange: data.deliveryFreeRange !== undefined ? (data.deliveryFreeRange ? parseFloat(data.deliveryFreeRange) : null) : undefined,
                deliveryShortRange: data.deliveryShortRange !== undefined ? (data.deliveryShortRange ? parseFloat(data.deliveryShortRange) : null) : undefined,
                deliveryShortPrice: data.deliveryShortPrice !== undefined ? (data.deliveryShortPrice ? parseFloat(data.deliveryShortPrice) : null) : undefined,
                deliveryMediumRange: data.deliveryMediumRange !== undefined ? (data.deliveryMediumRange ? parseFloat(data.deliveryMediumRange) : null) : undefined,
                deliveryMediumPrice: data.deliveryMediumPrice !== undefined ? (data.deliveryMediumPrice ? parseFloat(data.deliveryMediumPrice) : null) : undefined,
                deliveryLongRange: data.deliveryLongRange !== undefined ? (data.deliveryLongRange ? parseFloat(data.deliveryLongRange) : null) : undefined,
                deliveryLongPrice: data.deliveryLongPrice !== undefined ? (data.deliveryLongPrice ? parseFloat(data.deliveryLongPrice) : null) : undefined,
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
