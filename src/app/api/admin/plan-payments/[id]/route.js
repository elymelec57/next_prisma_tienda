import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function PUT(request, { params }) {
    const user = await authorizeRequest(request);
    const { id } = params;

    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const { action } = await request.json();
        const status = action === 'APPROVE' ? 'CONFIRMED' : 'REJECTED';

        const payment = await prisma.planPayment.update({
            where: { id: Number(id) },
            data: { status },
            include: {
                restaurant: true,
                plan: true,
            },
        });

        // If confirmed, update the restaurant's subscription
        if (status === 'CONFIRMED') {
            await prisma.subscription.upsert({
                where: { restaurantId: payment.restaurantId },
                update: {
                    planId: payment.planId,
                    status: 'active',
                    startDate: new Date(),
                },
                create: {
                    restaurantId: payment.restaurantId,
                    planId: payment.planId,
                    status: 'active',
                    startDate: new Date(),
                },
            });
        }

        return NextResponse.json({
            status: true,
            message: status === 'CONFIRMED' ? 'Pago aprobado y plan actualizado' : 'Pago rechazado',
            payment
        });
    } catch (error) {
        console.error('Payment update error:', error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
