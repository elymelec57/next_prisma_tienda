import { prisma } from '@/libs/prisma';
import { IUpdateContorno } from '@/interfaces/User/Contornos/UpdateContornoInterface';

export class UpdateContornoRepository implements IUpdateContorno {
    async update(id: number, data: any): Promise<any> {
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
