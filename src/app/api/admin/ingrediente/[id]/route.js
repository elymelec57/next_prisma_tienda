import { NextResponse } from 'next/server';
import { IngredienteRepository } from '@/repositories/IngredienteRepository';
import { IngredienteService } from '@/services/IngredienteService';
import { authorizeRequest } from '@/libs/auth';

const ingredienteRepository = new IngredienteRepository();
const ingredienteService = new IngredienteService(ingredienteRepository);

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
    const ingrediente = await ingredienteService.getIngredienteById(id);
    if (!ingrediente) {
      return NextResponse.json({ error: 'Ingrediente no encontrado' }, { status: 404 });
    }
    return NextResponse.json(ingrediente);
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
    await ingredienteService.deleteIngrediente(id);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
