import { NextResponse } from "next/server";
import { SucursalRepository } from "@/repositories/SucursalRepository";
import { SucursalService } from "@/services/SucursalService";

const sucursalRepository = new SucursalRepository();
const sucursalService = new SucursalService(sucursalRepository);

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const sucursal = await sucursalService.updateSucursal(params.id, data);
        return NextResponse.json({ status: true, data: sucursal });
    } catch (error) {
        console.error("Error al actualizar sucursal:", error);
        return NextResponse.json({ status: false, message: "Error al actualizar sucursal" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await sucursalService.deleteSucursal(params.id);
        return NextResponse.json({ status: true, message: "Sucursal eliminada" });
    } catch (error) {
        console.error("Error al eliminar sucursal:", error);
        return NextResponse.json({ status: false, message: "Error al eliminar sucursal" }, { status: 500 });
    }
}
