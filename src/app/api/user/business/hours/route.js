import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { restaurantId, sucursalId, hours } = await request.json();

        if (!restaurantId || !hours || !Array.isArray(hours)) {
            return NextResponse.json({ status: false, message: "Invalid data" }, { status: 400 });
        }

        const results = [];
        for (const hour of hours) {
            const existing = await prisma.restaurantHours.findFirst({
                where: {
                    restaurantId: Number(restaurantId),
                    sucursalId: sucursalId ? Number(sucursalId) : null,
                    dayOfWeek: hour.dayOfWeek,
                }
            });

            if (existing) {
                const updated = await prisma.restaurantHours.update({
                    where: { id: existing.id },
                    data: {
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    }
                });
                results.push(updated);
            } else {
                const created = await prisma.restaurantHours.create({
                    data: {
                        restaurantId: Number(restaurantId),
                        sucursalId: sucursalId ? Number(sucursalId) : null,
                        dayOfWeek: hour.dayOfWeek,
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    }
                });
                results.push(created);
            }
        }

        return NextResponse.json({ status: true, message: "Hours updated successfully", results });
    } catch (error) {
        console.error("Error updating hours:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
