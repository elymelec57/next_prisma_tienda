import { prisma } from '@/libs/prisma'
import { LoginInterface } from '@/contracts/login/LoginInterface'

export class LoginRepository implements LoginInterface {

    async findByEmail(email: string) {
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

    async findIdRestaurantByUserId(userId: number) {
        const restaurant = await prisma.restaurant.findUnique({
            where: { userId: Number(userId) },
            select: { id: true },
        });
        return restaurant?.id || null;
    }

    async findEmployeeByEmail(email: string) {
        return await prisma.empleado.findUnique({
            where: { email },
            include: { rol: true }
        });
    }
}