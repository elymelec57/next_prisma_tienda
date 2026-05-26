import { NextResponse } from "next/server";
import { AuthRepository } from "@/repositories/admin/Auth/AuthRepository";
import { AuthService } from "@/services/admin/Auth/AuthService";
import { authorizeAdmin } from "@/libs/authAdmin";

const repository = new AuthRepository();
const service = new AuthService(repository);

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function PUT(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const { form } = await request.json();

        await service.updateAdminProfile(Number(id), form);

        return NextResponse.json({ status: true, message: 'Update admin successfullys' });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
