import { prisma } from '@/libs/prisma';
import { IDeleteContorno } from '@/interfaces/User/Contornos/DeleteContornoInterface';

export class DeleteContornoRepository implements IDeleteContorno {
    async delete(id: number): Promise<any> {
        return await prisma.contornos.delete({
            where: {
                id: Number(id)
            },
        });
    }
}
