import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: {
                restaurantId: null,
                isActive: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ status: true, data: paymentMethods });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
