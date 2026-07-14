import { prisma } from '@/libs/prisma';
import { IDeleteIngredient } from '@/interfaces/User/Ingredient/DeleteIngredientInterface';

export class DeleteIngredientRepository implements IDeleteIngredient {
    async delete(id: number) {
        return await prisma.ingredienteRestaurante.delete({
            where: {
                id: Number(id)
            }
        });
    }
}
