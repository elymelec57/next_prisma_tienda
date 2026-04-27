import { NextResponse } from "next/server";
import { CajaService } from "@/services/CajaService";

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const data = await request.json();
        
        const cajaService = new CajaService();
        const updateData = {};
        if (data.nombre) updateData.nombre = data.nombre;
        if (data.sucursalId !== undefined) updateData.sucursalId = data.sucursalId ? Number(data.sucursalId) : null;

        const cajaActualizada = await cajaService.updateCaja(id, updateData);

        return NextResponse.json({ status: true, data: cajaActualizada, message: "Caja actualizada exitosamente" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const cajaService = new CajaService();
        
        await cajaService.deleteCaja(id);

        return NextResponse.json({ status: true, message: "Caja eliminada exitosamente" });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
