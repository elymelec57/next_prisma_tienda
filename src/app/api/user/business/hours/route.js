import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { restaurantId, hours } = await request.json();

        if (!restaurantId || !hours || !Array.isArray(hours)) {
            return NextResponse.json({ status: false, message: "Invalid data" }, { status: 400 });
        }

        // Use a transaction to ensure all hours are updated correctly
        const results = await prisma.$transaction(
            hours.map((hour) =>
                prisma.restaurantHours.upsert({
                    where: {
                        restaurantId_dayOfWeek: {
                            restaurantId: Number(restaurantId),
                            dayOfWeek: hour.dayOfWeek,
                        },
                    },
                    update: {
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    },
                    create: {
                        restaurantId: Number(restaurantId),
                        dayOfWeek: hour.dayOfWeek,
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    },
                })
            )
        );

        return NextResponse.json({ status: true, message: "Hours updated successfully", results });
    } catch (error) {
        console.error("Error updating hours:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
