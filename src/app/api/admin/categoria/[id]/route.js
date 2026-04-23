import { NextResponse } from 'next/server';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';
import { CategoriaService } from '@/services/CategoriaService';
import { authorizeRequest } from '@/libs/auth';

const categoriaRepository = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return false;
    }
    return true;
}

export async function GET(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const categoria = await categoriaService.getCategoriaById(id);
        if (!categoria) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }
        return NextResponse.json(categoria);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const deletedCategoria = await categoriaService.deleteCategoria(id);
        return NextResponse.json(deletedCategoria);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
