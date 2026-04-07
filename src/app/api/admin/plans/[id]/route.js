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
        const { name, price, productLimit, description } = await request.json();

        const plan = await prisma.plan.update({
            where: { id: Number(id) },
            data: {
                name,
                price: Number(price),
                productLimit: Number(productLimit),
                description,
            },
        });

        return NextResponse.json({ status: true, plan });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = await authorizeRequest(request);
    const { id } = params;

    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        await prisma.plan.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ status: true, message: 'Plan eliminado' });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
