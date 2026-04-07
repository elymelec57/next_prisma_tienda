import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const payments = await prisma.planPayment.findMany({
        where: {
            status: 'PENDING'
        },
        include: {
            subscription: {
                include: {
                    restaurant: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            plan: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return NextResponse.json(payments);
}
