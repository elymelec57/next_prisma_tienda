import { prisma } from '@/libs/prisma';

export class RolRepository {
    async findAll() {
        return await prisma.rol.findMany();
    }

    async findById(id) {
        return await prisma.rol.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.rol.create({
            data: {
                name: data.name
            }
        });
    }

    async update(id, data) {
        return await prisma.rol.update({
            where: { id: Number(id) },
            data: {
                name: data.name
            }
        });
    }

    async delete(id) {
        return await prisma.rol.delete({
            where: { id: Number(id) }
        });
    }
}
