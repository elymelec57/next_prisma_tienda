import { prisma } from '@/libs/prisma'

export class UserRepository {
    async findAll() {
        return await prisma.user.findMany({
            where: {
                roles: {
                    some: { name: 'User' }
                }
            },
        });
    }

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: Number(id) }
        });
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                roles: { select: { name: true } },
            },
        });
    }

    async create(data) {
        return await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
                roles: {
                    connect: { id: data.roleId || 2 }
                },
            },
        });
    }

    async update(id, data) {
        return await prisma.user.update({
            where: { id: Number(id) },
            data: data
        });
    }

    async delete(id) {
        return await prisma.user.delete({
            where: { id: Number(id) }
        });
    }
}
