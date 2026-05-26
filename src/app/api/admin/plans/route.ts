import { NextResponse } from 'next/server';
import { AllPlanRepository } from '@/repositories/admin/Plan/AllPlanRepository';
import { PlanRepository } from '@/repositories/admin/Plan/PlanRepository';
import { AllPlanService } from '@/services/admin/Plan/AllPlanService';
import { StorePlanService } from '@/services/admin/Plan/StorePlanService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new PlanRepository();

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
        const allRepository = new AllPlanRepository();
        const service = new AllPlanService(allRepository);
        const plans = await service.execute();
        return NextResponse.json(plans);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const service = new StorePlanService(repository);
        const plan = await service.execute(data);
        return NextResponse.json({ status: true, plan });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
