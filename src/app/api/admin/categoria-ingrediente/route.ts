import { NextResponse } from 'next/server';
import { AllCategoriaIngredienteRepository } from '@/repositories/admin/CategoriaIngrediente/AllCategoriaIngredienteRepository';
import { CategoriaIngredienteRepository } from '@/repositories/admin/CategoriaIngrediente/CategoriaIngredienteRepository';
import { AllCategoriaIngredienteService } from '@/services/admin/CategoriaIngrediente/AllCategoriaIngredienteService';
import { StoreCategoriaIngredienteService } from '@/services/admin/CategoriaIngrediente/StoreCategoriaIngredienteService';
import { UpdateCategoriaIngredienteService } from '@/services/admin/CategoriaIngrediente/UpdateCategoriaIngredienteService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new CategoriaIngredienteRepository();

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
        const allRepository = new AllCategoriaIngredienteRepository();
        const service = new AllCategoriaIngredienteService(allRepository);
        const categorias = await service.execute();
        return NextResponse.json({ status: true, categorias });
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
        const service = new StoreCategoriaIngredienteService(repository);
        await service.execute({ nombre: data.name });
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
        const service = new UpdateCategoriaIngredienteService(repository);
        await service.execute(data.id, { nombre: data.name });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
