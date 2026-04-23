import { NextResponse } from 'next/server';
import { CategoriaIngredienteRepository } from '@/repositories/CategoriaIngredienteRepository';
import { CategoriaIngredienteService } from '@/services/CategoriaIngredienteService';
import { authorizeRequest } from '@/libs/auth';

const categoriaIngredienteRepository = new CategoriaIngredienteRepository();
const categoriaIngredienteService = new CategoriaIngredienteService(categoriaIngredienteRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const categorias = await categoriaIngredienteService.getAllCategorias();
    return NextResponse.json({ status: true, categorias });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    await categoriaIngredienteService.createCategoria(data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const data = await request.json();
    await categoriaIngredienteService.updateCategoria(data.id, data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
