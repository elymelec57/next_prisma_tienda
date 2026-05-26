import { NextResponse } from 'next/server';
import { CategoriaRepository } from '@/repositories/admin/Categoria/CategoriaRepository';
import { GetCategoriaService } from '@/services/admin/Categoria/GetCategoriaService';
import { DeleteCategoriaService } from '@/services/admin/Categoria/DeleteCategoriaService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new CategoriaRepository();

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
        const service = new GetCategoriaService(repository);
        const categoria = await service.execute(id);
        if (!categoria) {
            return NextResponse.json({ error: 'Categoria no encontrada' }, { status: 404 });
        }
        return NextResponse.json(categoria);
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
        const service = new DeleteCategoriaService(repository);
        await service.execute(id);
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
