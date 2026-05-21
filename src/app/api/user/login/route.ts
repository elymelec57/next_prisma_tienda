import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { LoginService } from "@/services/Auth/LoginService";
import { LoginRepository } from "@/repositories/Auth/LoginRepository";

const loginRepository = new LoginRepository();
const loginService = new LoginService(loginRepository);

export async function POST(request: Request) {
    const { form } = await request.json()
    const cookieStore = await cookies()

    try {
        const { token, userData } = await loginService.execute(form.email, form.password); //await authService.login(form.email, form.password);

        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
        });

        return NextResponse.json({ status: true, message: 'login successfully', auth: userData })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
