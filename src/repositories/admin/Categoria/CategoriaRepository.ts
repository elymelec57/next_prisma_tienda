import { prisma } from "@/libs/prisma";
import { ICategoria, Categoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class CategoriaRepository implements ICategoria {
    async create(data: Categoria) {
        return await prisma.categoria.create({
            data: {
                nombre: data.nombre
            }
        });
    }

    async update(id: number, data: Categoria) {
        return await prisma.categoria.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id: number) {
        return await prisma.categoria.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.categoria.findUnique({
            where: { id: Number(id) }
        });
    }
}
