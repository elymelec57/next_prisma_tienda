import { NextResponse } from "next/server";
import { CajaRepository } from "@/repositories/User/Business/Caja/CajaRepository";
import { CajaService } from "@/services/User/Business/Caja/CajaService";

const cajaService = new CajaService(new CajaRepository());

// Open a new shift
export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.cajaId || !data.empleadoId || data.montoApertura === undefined) {
            return NextResponse.json({ status: false, message: "Datos incompletos" }, { status: 400 });
        }

        const turno = await cajaService.openShift({
            cajaId: Number(data.cajaId),
            empleadoId: Number(data.empleadoId),
            montoApertura: Number(data.montoApertura)
        });

        return NextResponse.json({ status: true, data: turno, message: "Turno abierto exitosamente" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
