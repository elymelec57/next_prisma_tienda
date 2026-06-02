import { prisma } from '@/libs/prisma';

export class DeleteContornoRepository {
    async delete(id) {
        return await prisma.contornos.delete({
            where: {
                id: Number(id)
            },
        });
    }
}
