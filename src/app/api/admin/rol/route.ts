import { NextResponse } from 'next/server';
import { AllRolRepository } from '@/repositories/admin/Rol/AllRolRepository';
import { RolRepository } from '@/repositories/admin/Rol/RolRepository';
import { AllRolService } from '@/services/admin/Rol/AllRolService';
import { StoreRolService } from '@/services/admin/Rol/StoreRolService';
import { UpdateRolService } from '@/services/admin/Rol/UpdateRolService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new RolRepository();

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
        const allRepository = new AllRolRepository();
        const service = new AllRolService(allRepository);
        const roles = await service.execute();
        return NextResponse.json({ status: true, roles });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { name } = await request.json();
        const service = new StoreRolService(repository);
        await service.execute({ name });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { name, id } = await request.json();
        const service = new UpdateRolService(repository);
        await service.execute(id, { name });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
