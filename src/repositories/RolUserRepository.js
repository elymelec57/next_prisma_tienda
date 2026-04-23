import { prisma } from '@/libs/prisma';

export class RolUserRepository {
    async findAll() {
        return await prisma.rolUser.findMany();
    }

    async findById(id) {
        return await prisma.rolUser.findUnique({
            where: { id: Number(id) }
        });
    }

    async create(data) {
        return await prisma.rolUser.create({
            data: {
                name: data.name
            }
        });
    }

    async update(id, data) {
        return await prisma.rolUser.update({
            where: { id: Number(id) },
            data: {
                name: data.name
            }
        });
    }

    async delete(id) {
        return await prisma.rolUser.delete({
            where: { id: Number(id) }
        });
    }
}
