import { prisma } from '@/libs/prisma'

export class AuthRepository {
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                roles: {
                    select: {
                        name: true
                    },
                },
            },
        });
    }

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });
    }

    async updateProfile(id, data) {
        return await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: data,
        });
    }
}
