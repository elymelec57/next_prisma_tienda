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

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const ingredientes = await ingredienteService.getAllIngredientes();
    return NextResponse.json({ status: true, ingredientes });
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
    await ingredienteService.createIngrediente(data);
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
    await ingredienteService.updateIngrediente(data.id, data);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
