import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/admin/User/UserRepository";
import { DeleteUserService } from "@/services/admin/User/DeleteUserService";
import { authorizeAdmin } from '@/libs/authAdmin';

const Repository = new UserRepository();

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
        const service = new DeleteUserService(Repository);
        await service.execute(params.id);
        return NextResponse.json({ status: true });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
