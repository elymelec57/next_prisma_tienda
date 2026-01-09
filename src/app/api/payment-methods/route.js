import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
        return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    try {
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
            },
        });
        return NextResponse.json(paymentMethods);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newPaymentMethod = await prisma.paymentMethod.create({
            data,
        });
        return NextResponse.json(newPaymentMethod, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
    }
}
