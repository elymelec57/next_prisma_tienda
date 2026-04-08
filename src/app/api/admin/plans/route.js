import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request) {
    // const user = await authorizeRequest(request);

    // if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'Admin')) {
    //     return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    // }

    const plans = await prisma.plan.findMany();
    return NextResponse.json(plans);
}

export async function POST(request) {
    // const user = await authorizeRequest(request);

    // if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
    //     return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    // }

    const { name, price, productLimit, description } = await request.json();

    const plan = await prisma.plan.create({
        data: {
            name,
            price: Number(price),
            productLimit: Number(productLimit),
            description,
        },
    });

    return NextResponse.json({ status: true, plan });
}
