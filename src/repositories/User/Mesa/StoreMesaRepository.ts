import { prisma } from '@/libs/prisma';
import { StoreMesaInterface } from '@/interfaces/User/Mesa/StoreMesaInterface';

export class StoreMesaRepository implements StoreMesaInterface {
    async findRestaurantByUserId(userId: number) {
        return await prisma.restaurant.findUnique({
            where: {
                userId: userId
            }
        });
    }

    async create(data) {
        return await prisma.mesa.create({
            data: data
        });
    }
}
