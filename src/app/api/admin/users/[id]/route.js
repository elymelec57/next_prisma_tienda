import { NextResponse } from "next/server";
import { UserRepository } from '@/repositories/admin/UserRepository';
import { UserService } from '@/services/admin/UserService';
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

export async function DELETE(request, segmentData) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    const params = await segmentData.params;
    try {
        await userService.deleteUser(params.id);
        return NextResponse.json({ status: true });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
