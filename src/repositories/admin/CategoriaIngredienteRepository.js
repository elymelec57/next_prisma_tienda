import { prisma } from '@/libs/prisma';
export class CategoriaIngredienteRepository {
    async findAll() { return await prisma.categoriaIngrediente.findMany(); }
    async findById(id) { return await prisma.categoriaIngrediente.findUnique({ where: { id: Number(id) } }); }
    async create(data) { return await prisma.categoriaIngrediente.create({ data: { name: data.name } }); }
    async update(id, data) { return await prisma.categoriaIngrediente.update({ where: { id: Number(id) }, data: { name: data.name } }); }
    async delete(id) { return await prisma.categoriaIngrediente.delete({ where: { id: Number(id) } }); }
}
