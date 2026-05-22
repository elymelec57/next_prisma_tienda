import { prisma } from '@/libs/prisma';
export class IngredienteRepository {
    async findAll() { return await prisma.ingrediente.findMany({ include: { categoria: true } }); }
    async findById(id) { return await prisma.ingrediente.findUnique({ where: { id: Number(id) }, include: { categoria: true } }); }
    async create(data) { return await prisma.ingrediente.create({ data: { name: data.name, precio: data.precio, categoriaId: data.categoriaId } }); }
    async update(id, data) { return await prisma.ingrediente.update({ where: { id: Number(id) }, data: { name: data.name, precio: data.precio, categoriaId: data.categoriaId } }); }
    async delete(id) { return await prisma.ingrediente.delete({ where: { id: Number(id) } }); }
}
