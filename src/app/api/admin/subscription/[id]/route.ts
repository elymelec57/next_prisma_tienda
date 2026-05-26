import { NextResponse } from 'next/server';
import { PlanPaymentRepository } from '@/repositories/admin/PlanPayment/PlanPaymentRepository';
import { ProcessPlanPaymentService } from '@/services/admin/PlanPayment/ProcessPlanPaymentService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new PlanPaymentRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function POST(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const bodyData = await request.json();
        const { body } = bodyData;
        const { action } = body;

        const service = new ProcessPlanPaymentService(repository);
        const result = await service.execute(id, action);
        return NextResponse.json({ status: true, ...result });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
