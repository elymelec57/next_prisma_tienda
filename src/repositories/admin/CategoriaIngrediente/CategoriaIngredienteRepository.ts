import { prisma } from "@/libs/prisma";
import { ICategoriaIngrediente, CategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class CategoriaIngredienteRepository implements ICategoriaIngrediente {
    async create(data: CategoriaIngrediente) {
        return await prisma.categoriaIngrediente.create({
            data: {
                nombre: data.nombre
            }
        });
    }

    async update(id: number, data: CategoriaIngrediente) {
        return await prisma.categoriaIngrediente.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre
            }
        });
    }

    async delete(id: number) {
        return await prisma.categoriaIngrediente.delete({
            where: { id: Number(id) }
        });
    }

    async findById(id: number) {
        return await prisma.categoriaIngrediente.findUnique({
            where: { id: Number(id) }
        });
    }
}
