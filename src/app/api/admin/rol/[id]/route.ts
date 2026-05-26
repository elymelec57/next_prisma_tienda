import { NextResponse } from 'next/server';
import { RolRepository } from '@/repositories/admin/Rol/RolRepository';
import { GetRolService } from '@/services/admin/Rol/GetRolService';
import { DeleteRolService } from '@/services/admin/Rol/DeleteRolService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new RolRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const service = new GetRolService(repository);
        const rol = await service.execute(id);
        if (!rol) {
            return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
        }
        return NextResponse.json(rol);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const service = new DeleteRolService(repository);
        await service.execute(id);
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
