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

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const contornos = await contornoService.getAllContornos();
    return NextResponse.json(contornos);
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
    const newContorno = await contornoService.createContorno(data);
    return NextResponse.json(newContorno);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
