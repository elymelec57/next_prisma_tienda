import { NextResponse } from "next/server";
import { CajaRepository } from "@/repositories/User/Business/Caja/CajaRepository";
import { CajaService } from "@/services/User/Business/Caja/CajaService";

const cajaService = new CajaService(new CajaRepository());

// Close a shift
export async function PUT(request: Request, segmentData: any) {
    try {
        const params = await segmentData.params;
        const data = await request.json();

        if (data.montoCierre === undefined) {
            return NextResponse.json({ status: false, message: "Falta el monto de cierre" }, { status: 400 });
        }

        const turno = await cajaService.closeShift(params.id, {
            montoCierre: Number(data.montoCierre)
        });

        return NextResponse.json({ status: true, data: turno, message: "Turno cerrado exitosamente" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
