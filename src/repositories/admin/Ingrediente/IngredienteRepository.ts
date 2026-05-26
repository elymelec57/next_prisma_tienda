import { prisma } from "@/libs/prisma";
import { IIngrediente, Ingrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class IngredienteRepository implements IIngrediente {
    async create(data: Ingrediente) {
        return await prisma.ingrediente.create({
            data: {
                nombre: data.nombre,
                categoriaIngrediente: {
                    connect: { id: Number(data.categoriaIngredienteId) }
                }
            }
        });
    }

    async update(id: number, data: Ingrediente) {
        return await prisma.ingrediente.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre,
                categoriaIngrediente: {
                    connect: { id: Number(data.categoriaIngredienteId) }
                }
            }
        });
    }

    async delete(id: number) {
        return await prisma.ingrediente.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.ingrediente.findUnique({
            where: { id: Number(id) },
            include: { categoriaIngrediente: true }
        });
    }
}
