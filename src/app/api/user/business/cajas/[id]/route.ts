import { NextResponse } from "next/server";
import { CajaRepository } from "@/repositories/User/Business/Caja/CajaRepository";
import { CajaService } from "@/services/User/Business/Caja/CajaService";
import { authorizeRequest } from "@/libs/auth";

const cajaService = new CajaService(new CajaRepository());

export async function PUT(request: Request, segmentData: any) {
    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ status: false, message: "Not authorized" }, { status: 401 });
    }
    try {
        const data = await request.json();
        const params = await segmentData.params;
        const updateData: { nombre?: string; sucursalId?: number | null } = {};

        if (data.nombre) updateData.nombre = data.nombre;
        if (data.sucursalId !== undefined) updateData.sucursalId = data.sucursalId ? Number(data.sucursalId) : null;

        const cajaActualizada = await cajaService.updateCaja(params.id, updateData);
        return NextResponse.json({ status: true, data: cajaActualizada, message: "Caja actualizada exitosamente" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, segmentData: any) {
    const params = await segmentData.params;
    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ status: false, message: "Not authorized" }, { status: 401 });
    }
    try {
        await cajaService.deleteCaja(params.id);
        return NextResponse.json({ status: true, message: "Caja eliminada exitosamente" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
