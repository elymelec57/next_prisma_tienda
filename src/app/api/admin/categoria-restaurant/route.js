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

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const categorias = await categoriaRestaurantService.getAllCategorias();
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
    await categoriaRestaurantService.createCategoria(data);
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
    await categoriaRestaurantService.updateCategoria(data.id, data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
