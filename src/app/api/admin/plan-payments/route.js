import { NextResponse } from 'next/server';
import { PlanPaymentRepository } from '@/repositories/PlanPaymentRepository';
import { PlanPaymentService } from '@/services/PlanPaymentService';
import { authorizeRequest } from '@/libs/auth';

const planPaymentRepository = new PlanPaymentRepository();
const planPaymentService = new PlanPaymentService(planPaymentRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
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
