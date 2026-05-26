import { NextResponse } from 'next/server';
import { CategoriaIngredienteRepository } from '@/repositories/admin/CategoriaIngrediente/CategoriaIngredienteRepository';
import { GetCategoriaIngredienteService } from '@/services/admin/CategoriaIngrediente/GetCategoriaIngredienteService';
import { DeleteCategoriaIngredienteService } from '@/services/admin/CategoriaIngrediente/DeleteCategoriaIngredienteService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new CategoriaIngredienteRepository();

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
        const service = new GetCategoriaIngredienteService(repository);
        const categoria = await service.execute(id);
        if (!categoria) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
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
        const service = new DeleteCategoriaIngredienteService(repository);
        await service.execute(id);
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
