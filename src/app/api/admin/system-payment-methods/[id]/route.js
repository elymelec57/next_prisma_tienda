import { NextResponse } from 'next/server';
import { SystemPaymentMethodRepository } from '@/repositories/SystemPaymentMethodRepository';
import { SystemPaymentMethodService } from '@/services/SystemPaymentMethodService';
import { authorizeRequest } from '@/libs/auth';

const systemPaymentMethodRepository = new SystemPaymentMethodRepository();
const systemPaymentMethodService = new SystemPaymentMethodService(systemPaymentMethodRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return false;
    }
    return true;
}

export async function GET(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const paymentMethod = await systemPaymentMethodService.getPaymentMethodById(id);

        if (!paymentMethod) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        return NextResponse.json({ status: true, data: paymentMethod });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const data = await request.json();
        const existing = await systemPaymentMethodService.getPaymentMethodById(id);

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        const updated = await systemPaymentMethodService.updatePaymentMethod(id, {
            ...data,
            restaurantId: null
        });

        return NextResponse.json({ status: true, message: "Updated successfully", data: updated });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const existing = await systemPaymentMethodService.getPaymentMethodById(id);

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        await systemPaymentMethodService.deletePaymentMethod(id);

        return NextResponse.json({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
