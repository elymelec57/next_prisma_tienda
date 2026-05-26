import { NextResponse } from 'next/server';
import { AllIngredienteRepository } from '@/repositories/admin/Ingrediente/AllIngredienteRepository';
import { IngredienteRepository } from '@/repositories/admin/Ingrediente/IngredienteRepository';
import { AllIngredienteService } from '@/services/admin/Ingrediente/AllIngredienteService';
import { StoreIngredienteService } from '@/services/admin/Ingrediente/StoreIngredienteService';
import { UpdateIngredienteService } from '@/services/admin/Ingrediente/UpdateIngredienteService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new IngredienteRepository();

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
        const allRepository = new AllIngredienteRepository();
        const service = new AllIngredienteService(allRepository);
        const ingredientes = await service.execute();
        return NextResponse.json({ status: true, ingredientes });
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
        const service = new StoreIngredienteService(repository);
        await service.execute({
            nombre: data.nombre,
            categoriaIngredienteId: data.categoriaIngredienteId
        });
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
        const data = await request.json();
        const service = new UpdateIngredienteService(repository);
        await service.execute(data.id, {
            nombre: data.nombre,
            categoriaIngredienteId: data.categoriaIngredienteId
        });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
