import { prisma } from '@/libs/prisma';
export class ContornoRepository {
    async findAll() { return await prisma.contorno.findMany(); }
    async findById(id) { return await prisma.contorno.findUnique({ where: { id: Number(id) } }); }
    async create(data) { return await prisma.contorno.create({ data: { name: data.name, price: data.price } }); }
    async update(id, data) { return await prisma.contorno.update({ where: { id: Number(id) }, data: { name: data.name, price: data.price } }); }
    async delete(id) { return await prisma.contorno.delete({ where: { id: Number(id) } }); }
}
