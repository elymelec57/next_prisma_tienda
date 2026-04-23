import { NextResponse } from 'next/server';
import { RolRepository } from '@/repositories/RolRepository';
import { RolService } from '@/services/RolService';
import { authorizeRequest } from '@/libs/auth';

const rolRepository = new RolRepository();
const rolService = new RolService(rolRepository);

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
    const rol = await rolService.getRolById(id);
    if (!rol) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
    }
    return NextResponse.json(rol);
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
    await rolService.deleteRol(id);
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
