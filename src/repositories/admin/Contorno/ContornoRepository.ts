import { prisma } from "@/libs/prisma";
import { IContorno, Contorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class ContornoRepository implements IContorno {
    async create(data: Contorno) {
        return await prisma.contorno.create({
            data: {
                nombre: data.nombre
            }
        });
    }

    async update(id: number, data: Contorno) {
        return await prisma.contorno.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id: number) {
        return await prisma.contorno.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.contorno.findUnique({
            where: { id: Number(id) }
        });
    }
}
