import { NextResponse } from 'next/server';
import { PlanRepository } from '@/repositories/admin/Plan/PlanRepository';
import { UpdatePlanService } from '@/services/admin/Plan/UpdatePlanService';
import { DeletePlanService } from '@/services/admin/Plan/DeletePlanService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new PlanRepository();

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
        const data = await request.json();
        const service = new UpdatePlanService(repository);
        const plan = await service.execute(id, data);
        return NextResponse.json({ status: true, plan });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const service = new DeletePlanService(repository);
        await service.execute(id);
        return NextResponse.json({ status: true, message: "Plan eliminado" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
