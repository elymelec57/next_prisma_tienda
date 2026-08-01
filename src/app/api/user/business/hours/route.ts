import { NextResponse } from "next/server";
import { HoursRepository } from "@/repositories/User/Business/Hours/HoursRepository";
import { HoursService } from "@/services/User/Business/Hours/HoursService";

const hoursService = new HoursService(new HoursRepository());

export async function POST(request: Request) {
    try {
        const { restaurantId, sucursalId, hours } = await request.json();

        const results = await hoursService.saveHours({ restaurantId, sucursalId, hours });

        return NextResponse.json({ status: true, message: "Hours updated successfully", results });
    } catch (error: any) {
        console.error("Error updating hours:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
