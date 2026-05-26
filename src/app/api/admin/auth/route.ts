import { NextResponse } from "next/server";
import { AuthRepository } from "@/repositories/admin/Auth/AuthRepository";
import { AuthService } from "@/services/admin/Auth/AuthService";

const repository = new AuthRepository();
const service = new AuthService(repository);

export async function POST(request: any) {
    try {
        const { form } = await request.json();
        const { auth, token } = await service.login(form.email, form.password);

        const response = NextResponse.json({ status: true, message: 'login exitoso', auth });
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 3600, // 1 hora
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
