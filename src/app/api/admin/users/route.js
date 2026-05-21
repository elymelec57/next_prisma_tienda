import { NextResponse } from "next/server";
import { UserRepository } from '@/repositories/UserRepository';
import { UserService } from '@/services/UserService';
import { authorizeAdmin } from '@/libs/authAdmin';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role.toLowerCase() !== 'admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const users = await userService.getAllUsers();
        return NextResponse.json({ status: true, users });
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
        const users = await userService.createUser(data);
        return NextResponse.json({ status: true, users });
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
        await userService.updateUser(data.id, data);
        return NextResponse.json({ status: true });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
