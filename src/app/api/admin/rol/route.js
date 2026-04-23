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

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const roles = await rolService.getAllRoles();
    return NextResponse.json({ status: true, roles });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
  try {
    const { name } = await request.json();
    await rolService.createRol({ name });
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
    const { name, id } = await request.json();
    await rolService.updateRol(id, { name });
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
