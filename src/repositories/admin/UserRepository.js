import { prisma } from '@/libs/prisma'

export class UserRepository {

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

    async delete(id) {
        return await prisma.user.delete({
            where: { id: Number(id) }
        });
    }
}
