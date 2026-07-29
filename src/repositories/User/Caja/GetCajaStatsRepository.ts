import { IGetCajaStats, CajaStatsResult } from '@/interfaces/User/Caja/GetCajaStatsInterface';
import { prisma } from '@/libs/prisma';

export class GetCajaStatsRepository implements IGetCajaStats {
    async getStats(restaurantId: number): Promise<CajaStatsResult> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const payments = await prisma.payment.findMany({
            where: {
                restaurantId,
                status: 'CONFIRMED',
                fechaHora: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                paymentMethod: true,
            },
        });
        console.log(startOfDay, endOfDay);
        console.log(payments);
        const totalIncome = payments.reduce((sum, p) => sum + p.monto, 0);

        const byMethod = payments.reduce<{ [key: string]: number }>((acc, p) => {
            const methodName = p.paymentMethod.type;
            acc[methodName] = (acc[methodName] || 0) + p.monto;
            return acc;
        }, {});

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { currency: true },
        });

        return {
            totalIncome,
            count: payments.length,
            byMethod,
            currency: restaurant?.currency || 'USD',
        };
    }
}
