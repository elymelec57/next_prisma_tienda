import { prisma } from '@/libs/prisma';

export class IngredienteRepository {
    async findAll() {
        return await prisma.ingrediente.findMany({
            include: {
                categoriaIngrediente: true
            }
        });
    }

    async findById(id) {
        return await prisma.ingrediente.findUnique({
            where: { id: Number(id) },
            include: {
                categoriaIngrediente: true
            }
        });
    }

    async create(data) {
        return await prisma.ingrediente.create({
            data: {
                nombre: data.nombre,
                categoriaIngrediente: {
                    connect: {
                        id: Number(data.categoriaIngredienteId)
                    }
                }
            }
        });
    }

    async update(id, data) {
        return await prisma.ingrediente.update({
            where: { id: Number(id) },
            data: {
                nombre: data.nombre,
                categoriaIngrediente: {
                    connect: {
                        id: Number(data.categoriaIngredienteId)
                    }
                }
            }
        });
    }

    async delete(id) {
        return await prisma.ingrediente.delete({
            where: { id: Number(id) }
        });
    }
}
