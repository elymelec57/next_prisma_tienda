import { NextResponse } from "next/server";
import { AuthRepository } from "@/repositories/admin/Auth/AuthRepository";
import { AuthService } from "@/services/admin/Auth/AuthService";

const repository = new AuthRepository();
const service = new AuthService(repository);

export async function POST(request: any) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
        return NextResponse.json({ status: false });
    }

    const auth = await service.verifyToken(token);
    if (auth) {
        return NextResponse.json({ status: true, auth });
    } else {
        return NextResponse.json({ status: false });
    }
}
