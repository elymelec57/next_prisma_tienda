import { NextResponse } from 'next/server';
import { CategoriaRestaurantRepository } from '@/repositories/CategoriaRestaurantRepository';
import { CategoriaRestaurantService } from '@/services/CategoriaRestaurantService';
import { authorizeRequest } from '@/libs/auth';

const categoriaRestaurantRepository = new CategoriaRestaurantRepository();
const categoriaRestaurantService = new CategoriaRestaurantService(categoriaRestaurantRepository);

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
    const categoria = await categoriaRestaurantService.getCategoriaById(id);
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
    const deletedCategoria = await categoriaRestaurantService.deleteCategoria(id);
    return NextResponse.json(deletedCategoria);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
