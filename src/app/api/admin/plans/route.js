import { NextResponse } from 'next/server';
import { PlanRepository } from '@/repositories/PlanRepository';
import { PlanService } from '@/services/PlanService';
import { authorizeRequest } from '@/libs/auth';

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);

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
        const plans = await planService.getAllPlans();
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const plan = await planService.createPlan(data);
        return NextResponse.json({ status: true, plan });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
