import { prisma } from '@/libs/prisma';

export class UpdateContornoRepository {
    async update(id, data) {
        return await prisma.contornos.update({
            where: {
                id: Number(id)
            },
            data: {
                nombre: data.nombre,
                price: Number(data.price),
            }
        });
    }
}
