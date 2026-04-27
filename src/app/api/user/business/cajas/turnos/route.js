import { NextResponse } from "next/server";
import { CajaService } from "@/services/CajaService";

// Open a new shift
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.cajaId || !data.empleadoId || data.montoApertura === undefined) {
            return NextResponse.json({ status: false, message: "Datos incompletos" }, { status: 400 });
        }

        const cajaService = new CajaService();
        const turno = await cajaService.openShift({
            cajaId: Number(data.cajaId),
            empleadoId: Number(data.empleadoId),
            montoApertura: Number(data.montoApertura)
        });

        return NextResponse.json({ status: true, data: turno, message: "Turno abierto exitosamente" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
