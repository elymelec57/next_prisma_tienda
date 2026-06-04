import { prisma } from '@/libs/prisma';

export class UpdateProfileRepository {
    async update(id, data) {
        return await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                name: data.name,
                email: data.email,
                ...(data.password && { password: data.password })
            }
        });
    }
}
