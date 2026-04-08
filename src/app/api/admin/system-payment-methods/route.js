import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    // const user = await authorizeRequest(request);

    // if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
    //     return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    // }

    try {
        const paymentMethods = await prisma.paymentMethod.findMany({
            // where: {
            //     restaurantId: null,
            // },
            // orderBy: {
            //     createdAt: 'desc',
            // },
        });

        const paymentTypes = ['PAGO_MOVIL', 'TRANSFERENCIA', 'ZELLE', 'EFECTIVO', 'ZINLI', 'PAYPAL'];

        return NextResponse.json({
            status: true,
            data: paymentMethods,
            paymentTypes
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    // const user = await authorizeRequest(request);

    // if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
    //     return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    // }

    try {
        const data = await request.json();

        const newPaymentMethod = await prisma.paymentMethod.create({
            data: {
                ...data,
                restaurantId: null, // Ensure it's a system-wide method
            },
        });

        return NextResponse.json({ status: true, message: "System payment method created", data: newPaymentMethod });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
