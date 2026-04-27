import { NextResponse } from "next/server";
import { CajaService } from "@/services/CajaService";

// Close a shift
export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const data = await request.json();
        
        if (data.montoCierre === undefined) {
            return NextResponse.json({ status: false, message: "Falta el monto de cierre" }, { status: 400 });
        }

        const cajaService = new CajaService();
        const turno = await cajaService.closeShift(id, {
            montoCierre: Number(data.montoCierre)
        });

        return NextResponse.json({ status: true, data: turno, message: "Turno cerrado exitosamente" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
