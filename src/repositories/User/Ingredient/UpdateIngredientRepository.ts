import { prisma } from '@/libs/prisma';
import { IUpdateIngredient } from '@/interfaces/User/Ingredient/UpdateIngredientInterface';

export class UpdateIngredientRepository implements IUpdateIngredient {
    async update(id: number, data: any) {
        return await prisma.ingredienteRestaurante.update({
            where: {
                id: Number(id)
            },
            data: {
                nombre: data.nombre,
                categoria: data.categoria,
                sku: data.sku,
                unidadMedida: data.unidadMedida,
                costoUnitario: Number(data.costoUnitario) || 0,
                stockActual: Number(data.stockActual) || 0,
                stockMinimo: Number(data.stockMinimo) || 0,
                stockMaximo: data.stockMaximo ? Number(data.stockMaximo) : null,
                fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
            }
        });
    }
}
