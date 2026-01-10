import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { restaurantId, paymentMethod } = await request.json();

        if (!restaurantId || !paymentMethod) {
            return NextResponse.json({ status: false, message: "Missing data" }, { status: 400 });
        }

        const newPaymentMethod = await prisma.paymentMethod.create({
            data: {
                ...paymentMethod,
                restaurantId: Number(restaurantId),
            },
        });

        return NextResponse.json({ status: true, message: "Payment method created", data: newPaymentMethod });
    } catch (error) {
        console.error("Error creating payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
        return NextResponse.json({ status: false, message: "Restaurant ID required" }, { status: 400 });
    }

    try {
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: {
                restaurantId: Number(restaurantId),
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ status: true, data: paymentMethods });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
