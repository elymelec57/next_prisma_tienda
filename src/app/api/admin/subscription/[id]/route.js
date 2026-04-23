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

export async function POST(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { body } = await request.json();
        const { action } = body;

        const result = await planPaymentService.processPaymentAction(id, action);
        return NextResponse.json({ status: true, ...result });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
