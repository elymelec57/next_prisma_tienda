import { NextResponse } from 'next/server';
import { ContornoRepository } from '@/repositories/admin/Contorno/ContornoRepository';
import { GetContornoService } from '@/services/admin/Contorno/GetContornoService';
import { UpdateContornoService } from '@/services/admin/Contorno/UpdateContornoService';
import { DeleteContornoService } from '@/services/admin/Contorno/DeleteContornoService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new ContornoRepository();

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
        const service = new GetContornoService(repository);
        const contorno = await service.execute(id);
        if (!contorno) {
            return NextResponse.json({ error: 'Contorno no encontrado' }, { status: 404 });
        }
        return NextResponse.json(contorno);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const data = await request.json();
        const service = new UpdateContornoService(repository);
        const updatedContorno = await service.execute(id, data);
        return NextResponse.json(updatedContorno);
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
        const service = new DeleteContornoService(repository);
        const deletedContorno = await service.execute(id);
        return NextResponse.json(deletedContorno);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
