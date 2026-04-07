import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { userId: user.auth.id },
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const payments = await prisma.planPayment.findMany({
            where: {
                restaurantId: restaurant.id,
            },
            include: {
                plan: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ status: true, data: payments });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
