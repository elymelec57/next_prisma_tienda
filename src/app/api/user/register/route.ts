import { NextResponse } from "next/server";
import { RegisterService } from "@/services/Auth/RegisterService";
import { RegisterRepository } from "@/repositories/Auth/RegisterRepository";

const registerRepository = new RegisterRepository();
const registerService = new RegisterService(registerRepository);

export async function POST(request: Request) {
    const { form } = await request.json();

    try {
        const user = await registerService.execute(form);
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: 'Error al registrar usuario' },
            { status: 400 }
        );
    }
}
