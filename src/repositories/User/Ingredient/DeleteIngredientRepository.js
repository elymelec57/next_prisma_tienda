import { prisma } from '@/libs/prisma';

export class DeleteIngredientRepository {
    async delete(id) {
        return await prisma.ingredienteRestaurante.delete({
            where: {
                id: Number(id)
            }
        });
    }
}
