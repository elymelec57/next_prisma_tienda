
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "UserId is required" }, { status: 400 });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: {
                userId: Number(userId)
            },
            select: {
                id: true
            }
        });

        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        const contornos = await prisma.contornos.findMany({
            where: {
                restaurantId: restaurant.id
            }
        });

        return NextResponse.json(contornos);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching contornos", error }, { status: 500 });
    }
}
