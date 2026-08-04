import { prisma } from '@/libs/prisma';
import { IGetClientsRepository } from '@/interfaces/User/Clients/GetClientsInterface';

export class ClientRepository implements IGetClientsRepository {
    async findRestaurantByUserId(userId: number) {
        return await prisma.restaurant.findUnique({
            where: {
                userId: Number(userId)
            },
            include: {
                cliente: true
            }
        });
    }
}
