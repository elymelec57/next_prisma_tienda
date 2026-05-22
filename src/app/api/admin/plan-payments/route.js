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

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const payments = await planPaymentService.getAllPayments();
        return NextResponse.json({ status: true, data: payments });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
