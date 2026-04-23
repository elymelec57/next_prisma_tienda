import { NextResponse } from 'next/server';
import { ContornoRepository } from '@/repositories/ContornoRepository';
import { ContornoService } from '@/services/ContornoService';
import { authorizeRequest } from '@/libs/auth';

const contornoRepository = new ContornoRepository();
const contornoService = new ContornoService(contornoRepository);

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
    const contorno = await contornoService.getContornoById(id);
    if (!contorno) {
      return NextResponse.json({ error: 'Contorno no encontrado' }, { status: 404 });
    }
    return NextResponse.json(contorno);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { id } = await params;
    const data = await request.json();
    const updatedContorno = await contornoService.updateContorno(id, data);
    return NextResponse.json(updatedContorno);
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
    const deletedContorno = await contornoService.deleteContorno(id);
    return NextResponse.json(deletedContorno);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
