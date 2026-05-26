import { NextResponse } from 'next/server';
import { AllSystemPaymentMethodRepository } from '@/repositories/admin/SystemPaymentMethod/AllSystemPaymentMethodRepository';
import { SystemPaymentMethodRepository } from '@/repositories/admin/SystemPaymentMethod/SystemPaymentMethodRepository';
import { AllSystemPaymentMethodService } from '@/services/admin/SystemPaymentMethod/AllSystemPaymentMethodService';
import { StoreSystemPaymentMethodService } from '@/services/admin/SystemPaymentMethod/StoreSystemPaymentMethodService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new SystemPaymentMethodRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const allRepository = new AllSystemPaymentMethodRepository();
        const service = new AllSystemPaymentMethodService(allRepository);
        const paymentMethods = await service.execute();
        const paymentTypes = ['PAGO_MOVIL', 'TRANSFERENCIA', 'ZELLE', 'EFECTIVO', 'ZINLI', 'PAYPAL'];

        return NextResponse.json({
            status: true,
            data: paymentMethods,
            paymentTypes
        });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const service = new StoreSystemPaymentMethodService(repository);
        const newPaymentMethod = await service.execute({
            ...data,
            restaurantId: null
        });

        return NextResponse.json({ status: true, message: "System payment method created", data: newPaymentMethod });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
