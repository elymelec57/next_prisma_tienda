import { NextResponse } from "next/server";
import { CajaService } from "@/services/CajaService";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const restaurantId = searchParams.get('restaurantId');
        
        if (!restaurantId) {
            return NextResponse.json({ status: false, message: "Missing restaurantId" }, { status: 400 });
        }

        const cajaService = new CajaService();
        const cajas = await cajaService.getCajasByRestaurant(restaurantId);

        return NextResponse.json({ status: true, data: cajas });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.nombre || !data.restaurantId) {
            return NextResponse.json({ status: false, message: "Datos incompletos" }, { status: 400 });
        }

        const cajaService = new CajaService();
        const nuevaCaja = await cajaService.createCaja({
            nombre: data.nombre,
            restaurantId: Number(data.restaurantId),
            sucursalId: data.sucursalId ? Number(data.sucursalId) : null,
            estado: "Cerrada",
            balanceActual: 0.0
        });

        return NextResponse.json({ status: true, data: nuevaCaja, message: "Caja creada exitosamente" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
