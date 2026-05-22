import { NextResponse } from 'next/server';
import { PlanPaymentRepository } from '@/repositories/admin/PlanPaymentRepository';
import { PlanPaymentService } from '@/services/admin/PlanPaymentService';
import { authorizeAdmin } from '@/libs/authAdmin';

const planPaymentRepository = new PlanPaymentRepository();
const planPaymentService = new PlanPaymentService(planPaymentRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function PUT(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { action } = await request.json();

        // Standardize action names if needed, but here we'll follow the existing logic
        // with a small adjustment to match the service expectations
        const serviceAction = action === 'APPROVE' ? 'approve' : (action === 'REJECT' ? 'reject' : action.toLowerCase());

        const result = await planPaymentService.processPaymentAction(id, serviceAction);

        return NextResponse.json({
            status: true,
            message: result.message,
            ...result
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
