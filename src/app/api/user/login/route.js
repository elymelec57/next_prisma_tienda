import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { UserRepository } from "@/repositories/UserRepository";
import { RestaurantRepository } from "@/repositories/RestaurantRepository";
import { AuthService } from "@/services/AuthService";

const userRepository = new UserRepository();
const restaurantRepository = new RestaurantRepository();
const authService = new AuthService(userRepository, restaurantRepository);

export async function POST(request) {
    const { form } = await request.json()
    const cookieStore = await cookies()

    try {
        const { token, userData } = await authService.login(form.email, form.password);

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
