import { NextResponse } from 'next/server';
import { IngredienteRepository } from '@/repositories/admin/Ingrediente/IngredienteRepository';
import { GetIngredienteService } from '@/services/admin/Ingrediente/GetIngredienteService';
import { DeleteIngredienteService } from '@/services/admin/Ingrediente/DeleteIngredienteService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new IngredienteRepository();

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
        const service = new GetIngredienteService(repository);
        const ingrediente = await service.execute(id);
        if (!ingrediente) {
            return NextResponse.json({ error: 'Ingrediente no encontrado' }, { status: 404 });
        }
        return NextResponse.json(ingrediente);
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
        const service = new DeleteIngredienteService(repository);
        await service.execute(id);
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
