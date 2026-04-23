import { NextResponse } from "next/server";
import { RolUserRepository } from '@/repositories/RolUserRepository';
import { RolUserService } from '@/services/RolUserService';
import { authorizeRequest } from '@/libs/auth';

const rolUserRepository = new RolUserRepository();
const rolUserService = new RolUserService(rolUserRepository);

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
        const roles = await rolUserService.getAllRoles();
        return NextResponse.json({ status: true, roles });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function POST(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        await rolUserService.createRol(data);
        return NextResponse.json({ status: true });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function PUT(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        await rolUserService.updateRol(data.id, data);
        return NextResponse.json({ status: true });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
