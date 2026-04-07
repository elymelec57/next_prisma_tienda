import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
        where: { userId: user.auth.id },
        include: {
            subscription: {
                include: {
                    plan: true,
                },
            },
        },
    });

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const plans = await prisma.plan.findMany();

    return NextResponse.json({
        subscription: restaurant.subscription,
        availablePlans: plans,
    });
}

export async function POST(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { planId, paymentMethod, transactionId } = await request.json();

    const restaurant = await prisma.restaurant.findUnique({
        where: { userId: user.auth.id },
    });

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const plan = await prisma.plan.findUnique({
        where: { id: Number(planId) },
    });

    if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // If plan is free, activate it immediately
    if (plan.price === 0) {
        const subscription = await prisma.subscription.upsert({
            where: { restaurantId: restaurant.id },
            update: {
                planId: plan.id,
                status: 'active',
                startDate: new Date(),
            },
            create: {
                restaurantId: restaurant.id,
                planId: plan.id,
                status: 'active',
                startDate: new Date(),
            },
        });
        return NextResponse.json({ status: true, subscription });
    }

    // If plan is paid, create a payment for admin to confirm
    const payment = await prisma.planPayment.create({
        data: {
            restaurantId: restaurant.id,
            planId: plan.id,
            amount: plan.price,
            paymentMethod,
            transactionId,
            status: 'PENDING',
        },
    });

    return NextResponse.json({ status: true, payment, message: 'Pago registrado, esperando confirmación del administrador.' });
}
