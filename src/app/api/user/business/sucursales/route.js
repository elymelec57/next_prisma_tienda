import { NextResponse } from "next/server";
import { SucursalRepository } from "@/repositories/SucursalRepository";
import { SucursalService } from "@/services/SucursalService";

const sucursalRepository = new SucursalRepository();
const sucursalService = new SucursalService(sucursalRepository);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
        return NextResponse.json({ status: false, message: "restaurantId es requerido" }, { status: 400 });
    }

    try {
        const sucursales = await sucursalService.getSucursalesByRestaurantId(restaurantId);
        return NextResponse.json({ status: true, data: sucursales });
    } catch (error) {
        console.error("Error al obtener sucursales:", error);
        return NextResponse.json({ status: false, message: "Error al obtener sucursales" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const sucursal = await sucursalService.createSucursal(data);
        return NextResponse.json({ status: true, data: sucursal });
    } catch (error) {
        console.error("Error al crear sucursal:", error);
        return NextResponse.json({ status: false, message: error.message || "Error al crear sucursal" }, { status: 500 });
    }
}
