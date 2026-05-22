import { prisma } from '@/libs/prisma';
export class CategoriaRepository {
    async findAll() { return await prisma.categoria.findMany(); }
    async findById(id) { return await prisma.categoria.findUnique({ where: { id: Number(id) } }); }
    async create(data) { return await prisma.categoria.create({ data: { name: data.name } }); }
    async update(id, data) { return await prisma.categoria.update({ where: { id: Number(id) }, data: { name: data.name } }); }
    async delete(id) { return await prisma.categoria.delete({ where: { id: Number(id) } }); }
}
