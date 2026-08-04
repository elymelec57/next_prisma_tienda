import { prisma } from '@/libs/prisma';

export class ProfileRepository {
    async findById(id) {
        return await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
    }
}
