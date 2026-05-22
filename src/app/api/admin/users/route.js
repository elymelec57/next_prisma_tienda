import { NextResponse } from "next/server";
import { UserRepository } from '@/repositories/admin/UserRepository';
import { AllUserRepository } from "@/repositories/admin/User/AllUserRepository";
import { UserService } from '@/services/admin/UserService';
import { AllUserService } from '@/services/admin/User/AllUserService';
import { authorizeAdmin } from '@/libs/authAdmin';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const allUserRepository = new AllUserRepository();
        const allUsersService = new AllUserService(allUserRepository);
        const response = await allUsersService.execute();
        return NextResponse.json({ status: true, users: response.users, roles: response.roles });
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
