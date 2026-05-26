import { NextResponse } from 'next/server';
import { AllPlanPaymentRepository } from '@/repositories/admin/PlanPayment/AllPlanPaymentRepository';
import { AllPlanPaymentService } from '@/services/admin/PlanPayment/AllPlanPaymentService';
import { authorizeAdmin } from '@/libs/authAdmin';

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
        const repository = new AllPlanPaymentRepository();
        const service = new AllPlanPaymentService(repository);
        const payments = await service.execute();
        return NextResponse.json({ status: true, data: payments });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
