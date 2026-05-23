import { NextResponse } from "next/server";
import { AllRoleRepository } from "@/repositories/admin/Role/AllRoleRepository";
import { RoleRepository } from "@/repositories/admin/Role/RoleRepository";
import { AllRoleService } from "@/services/admin/Role/AllRoleService";
import { StoreRoleService } from "@/services/admin/Role/StoreRoleService";
import { UpdateRoleService } from "@/services/admin/Role/UpdateRoleService";
import { authorizeAdmin } from '@/libs/authAdmin';

const Repository = new RoleRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const allRoleRepository = new AllRoleRepository();
        const allRoleService = new AllRoleService(allRoleRepository);
        const roles = await allRoleService.execute();
        return NextResponse.json({ status: true, roles });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function POST(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const roleService = new StoreRoleService(Repository);
        const roles = await roleService.execute(data);
        return NextResponse.json({ status: true, roles });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function PUT(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const updateRole = new UpdateRoleService(Repository);
        await updateRole.execute(data.id, data);
        return NextResponse.json({ status: true });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
