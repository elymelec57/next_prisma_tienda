import { NextResponse } from 'next/server';
import { SystemPaymentMethodRepository } from '@/repositories/admin/SystemPaymentMethodRepository';
import { SystemPaymentMethodService } from '@/services/admin/SystemPaymentMethodService';
import { authorizeAdmin } from '@/libs/authAdmin';

const systemPaymentMethodRepository = new SystemPaymentMethodRepository();
const systemPaymentMethodService = new SystemPaymentMethodService(systemPaymentMethodRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const paymentMethods = await systemPaymentMethodService.getAllPaymentMethods();
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
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const newPaymentMethod = await systemPaymentMethodService.createPaymentMethod({
            ...data,
            restaurantId: null
        });

        return NextResponse.json({ status: true, message: "System payment method created", data: newPaymentMethod });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
