
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

async function getRestaurantId() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        return decoded.data.restauranteId
    } catch (err) {
        return null
    }
}

export async function GET() {
    try {
        const restaurantId = await getRestaurantId()
        if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
                    lte: endOfDay
                }
            },
            include: {
                paymentMethod: true
            }
        });

        const totalIncome = payments.reduce((sum, p) => sum + p.monto, 0);

        // Agrupar por método
        const byMethod = payments.reduce((acc, p) => {
            const methodName = p.paymentMethod.type;
            acc[methodName] = (acc[methodName] || 0) + p.monto;
            return acc;
        }, {});

        return NextResponse.json({
            totalIncome,
            count: payments.length,
            byMethod
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
