import { NextResponse } from 'next/server';
import { AllContornoRepository } from '@/repositories/admin/Contorno/AllContornoRepository';
import { ContornoRepository } from '@/repositories/admin/Contorno/ContornoRepository';
import { AllContornoService } from '@/services/admin/Contorno/AllContornoService';
import { StoreContornoService } from '@/services/admin/Contorno/StoreContornoService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new ContornoRepository();

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
        const allRepository = new AllContornoRepository();
        const service = new AllContornoService(allRepository);
        const contornos = await service.execute();
        return NextResponse.json(contornos);
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
        const service = new StoreContornoService(repository);
        const newContorno = await service.execute(data);
        return NextResponse.json(newContorno);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
