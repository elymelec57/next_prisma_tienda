import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request) {
    try {
        const subscriptions = await prisma.planPayment.findMany({
            include: {
                restaurant: {
                    include: {
                        user: true
                    }
                },
                plan: true
            }
        });
        return NextResponse.json({ status: true, subscriptions });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({ status: false, message: "Error fetching subscriptions" }, { status: 500 });
    }
}