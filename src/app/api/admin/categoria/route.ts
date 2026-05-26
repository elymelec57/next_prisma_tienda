import { NextResponse } from 'next/server';
import { AllCategoriaRepository } from '@/repositories/admin/Categoria/AllCategoriaRepository';
import { CategoriaRepository } from '@/repositories/admin/Categoria/CategoriaRepository';
import { AllCategoriaService } from '@/services/admin/Categoria/AllCategoriaService';
import { StoreCategoriaService } from '@/services/admin/Categoria/StoreCategoriaService';
import { UpdateCategoriaService } from '@/services/admin/Categoria/UpdateCategoriaService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new CategoriaRepository();

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
        const allRepository = new AllCategoriaRepository();
        const service = new AllCategoriaService(allRepository);
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
        const service = new StoreCategoriaService(repository);
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
        const service = new UpdateCategoriaService(repository);
        await service.execute(data.id, { nombre: data.name });
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
