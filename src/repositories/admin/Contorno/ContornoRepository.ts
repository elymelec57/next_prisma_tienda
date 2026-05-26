import { prisma } from "@/libs/prisma";
import { IContorno, Contorno } from "@/interfaces/admin/Contorno/ContornoInterface";

export class ContornoRepository implements IContorno {
    async create(data: Contorno) {
        return await prisma.contornos.create({
            data: {
                nombre: data.nombre,
                restaurant: {
                    connect: { id: Number(1) }// por definir el restaurante
                }
            }
        });
    }

    async update(id: number, data: Contorno) {
        return await prisma.contornos.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id: number) {
        return await prisma.contornos.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.contornos.findUnique({
            where: { id: Number(id) }
        });
    }
}
