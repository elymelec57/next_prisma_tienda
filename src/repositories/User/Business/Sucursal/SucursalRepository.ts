import { prisma } from '@/libs/prisma';
import { ISucursalRepository, ICreateSucursalData, IUpdateSucursalData, ISucursal } from '@/interfaces/User/Business/Sucursal/ISucursalRepository';

export class SucursalRepository implements ISucursalRepository {
    async findAllByRestaurantId(restaurantId: number | string): Promise<ISucursal[]> {
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
        }) as ISucursal[];
    }

    async findById(id: number | string): Promise<ISucursal | null> {
        return await prisma.sucursal.findUnique({
            where: { id: Number(id) },
            include: {
                restaurant: true,
                platos: true
            }
        }) as ISucursal | null;
    }

    async create(data: ICreateSucursalData): Promise<ISucursal> {
        return await prisma.sucursal.create({
            data: {
                nombre: data.nombre,
                direccion: data.direccion,
                telefono: data.telefono,
                lat: data.lat ? parseFloat(String(data.lat)) : null,
                lng: data.lng ? parseFloat(String(data.lng)) : null,
                deliveryFreeRange: data.deliveryFreeRange ? parseFloat(String(data.deliveryFreeRange)) : null,
                deliveryShortRange: data.deliveryShortRange ? parseFloat(String(data.deliveryShortRange)) : null,
                deliveryShortPrice: data.deliveryShortPrice ? parseFloat(String(data.deliveryShortPrice)) : null,
                deliveryMediumRange: data.deliveryMediumRange ? parseFloat(String(data.deliveryMediumRange)) : null,
                deliveryMediumPrice: data.deliveryMediumPrice ? parseFloat(String(data.deliveryMediumPrice)) : null,
                deliveryLongRange: data.deliveryLongRange ? parseFloat(String(data.deliveryLongRange)) : null,
                deliveryLongPrice: data.deliveryLongPrice ? parseFloat(String(data.deliveryLongPrice)) : null,
                restaurant: {
                    connect: { id: Number(data.restaurantId) }
                },
                platos: {
                    connect: data.platos ? data.platos.map((id: number) => ({ id: Number(id) })) : []
                }
            }
        }) as ISucursal;
    }

    async update(id: number | string, data: IUpdateSucursalData): Promise<ISucursal> {
        return await prisma.sucursal.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre,
                direccion: data.direccion,
                telefono: data.telefono,
                lat: data.lat ? parseFloat(String(data.lat)) : null,
                lng: data.lng ? parseFloat(String(data.lng)) : null,
                deliveryFreeRange: data.deliveryFreeRange !== undefined ? (data.deliveryFreeRange ? parseFloat(String(data.deliveryFreeRange)) : null) : undefined,
                deliveryShortRange: data.deliveryShortRange !== undefined ? (data.deliveryShortRange ? parseFloat(String(data.deliveryShortRange)) : null) : undefined,
                deliveryShortPrice: data.deliveryShortPrice !== undefined ? (data.deliveryShortPrice ? parseFloat(String(data.deliveryShortPrice)) : null) : undefined,
                deliveryMediumRange: data.deliveryMediumRange !== undefined ? (data.deliveryMediumRange ? parseFloat(String(data.deliveryMediumRange)) : null) : undefined,
                deliveryMediumPrice: data.deliveryMediumPrice !== undefined ? (data.deliveryMediumPrice ? parseFloat(String(data.deliveryMediumPrice)) : null) : undefined,
                deliveryLongRange: data.deliveryLongRange !== undefined ? (data.deliveryLongRange ? parseFloat(String(data.deliveryLongRange)) : null) : undefined,
                deliveryLongPrice: data.deliveryLongPrice !== undefined ? (data.deliveryLongPrice ? parseFloat(String(data.deliveryLongPrice)) : null) : undefined,
                platos: data.platos ? {
                    set: data.platos.map((id: number) => ({ id: Number(id) }))
                } : undefined
            }
        }) as ISucursal;
    }

    async delete(id: number | string): Promise<ISucursal> {
        return await prisma.sucursal.delete({
            where: { id: Number(id) }
        }) as ISucursal;
    }
}
