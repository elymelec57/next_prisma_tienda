import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth';

export async function GET(request, { params }) {
    const user = await authorizeRequest(request);
    const { id } = params;

    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const paymentMethod = await prisma.paymentMethod.findFirst({
            where: {
                id,
                restaurantId: null,
            },
        });

        if (!paymentMethod) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        return NextResponse.json({ status: true, data: paymentMethod });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const user = await authorizeRequest(request);
    const { id } = params;

    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Ensure we only update a system method
        const existing = await prisma.paymentMethod.findFirst({
            where: { id, restaurantId: null }
        });

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        const updated = await prisma.paymentMethod.update({
            where: { id },
            data: {
                ...data,
                restaurantId: null, // Force keep as system method
            },
        });

        return NextResponse.json({ status: true, message: "Updated successfully", data: updated });
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
        // Ensure we only delete a system method
        const existing = await prisma.paymentMethod.findFirst({
            where: { id, restaurantId: null }
        });

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        await prisma.paymentMethod.delete({
            where: { id },
        });

        return NextResponse.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
