import { prisma } from '@/libs/prisma';

export class StoreMesaRepository {
    async create(data) {
        return await prisma.mesa.create({
            data: data
        });
    }
}
