import { NextResponse } from "next/server";
import { UserRepository } from '@/repositories/UserRepository';
import { UserService } from '@/services/UserService';
import { authorizeRequest } from '@/libs/auth';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
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
