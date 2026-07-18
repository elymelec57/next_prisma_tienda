import { prisma } from '@/libs/prisma';
import { IStoreIngredient } from '@/interfaces/User/Ingredient/StoreIngredientInterface';

export class StoreIngredientRepository implements IStoreIngredient {
    async create(data: any) {
        return await prisma.ingredienteRestaurante.create({
            data: {
                nombre: data.nombre,
                categoria: data.categoria,
                sku: data.sku,
                unidadMedida: data.unidadMedida,
                restaurant: {
                    connect: {
                        id: Number(data.restaurantId),
                    },
                },
                costoUnitario: Number(data.costoUnitario) || 0,
                stockActual: Number(data.stockActual) || 0,
                stockMinimo: Number(data.stockMinimo) || 0,
                stockMaximo: data.stockMaximo ? Number(data.stockMaximo) : null,
                fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
                sucursal: data.sucursalId && data.sucursalId !== 'main' ? {
                    connect: {
                        id: Number(data.sucursalId)
                    }
                } : undefined,
            },
        });
    }
}
