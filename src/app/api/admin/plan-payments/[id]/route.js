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

export async function PUT(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { action } = await request.json();

        const normalizedAction = action === 'APPROVE' ? 'CONFIRMED' : action;

        const result = await planPaymentService.processPaymentAction(id, normalizedAction);

        return NextResponse.json({
            status: true,
            message: normalizedAction === 'CONFIRMED' ? 'Pago aprobado y plan actualizado' : 'Pago rechazado',
            ...result
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
