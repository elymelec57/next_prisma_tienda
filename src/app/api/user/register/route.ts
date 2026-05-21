import { NextResponse } from "next/server";
import { RegisterService } from "@/services/Auth/RegisterService";
import { RegisterRepository } from "@/repositories/Auth/RegisterRepository";

const registerRepository = new RegisterRepository();
const registerService = new RegisterService(registerRepository);

export async function POST(request: Request) {
    const { form } = await request.json()

    try {
        const user = await registerService.execute(form);
        return NextResponse.json({ status: true, message: 'User created successfully' })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
