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

export async function PUT(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { action } = await request.json();

        const serviceAction = action === 'APPROVE' ? 'approve' : (action === 'REJECT' ? 'reject' : action.toLowerCase());

        const service = new ProcessPlanPaymentService(repository);
        const result = await service.execute(id, serviceAction);

        return NextResponse.json({
            status: true,
            message: result.message,
            ...result
        });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
