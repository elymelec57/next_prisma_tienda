import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";
import { RestaurantRepository } from "@/repositories/RestaurantRepository";
import { AuthService } from "@/services/AuthService";

const userRepository = new UserRepository();
const restaurantRepository = new RestaurantRepository();
const authService = new AuthService(userRepository, restaurantRepository);

export async function POST(request) {
    const { form } = await request.json()

    try {
        const user = await authService.register(form);
        return NextResponse.json({ status: true, message: 'User created successfully' })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
