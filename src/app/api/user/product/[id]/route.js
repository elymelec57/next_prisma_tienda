import { NextResponse } from "next/server";
import deleteImage from "@/libs/deleteImage";
import { UpdatePlatoRepository } from "@/repositories/User/Plato/UpdatePlatoRepository";
import { UpdatePlatoService } from "@/services/User/Plato/UpdatePlatpService";
import { DeletePlatoRepository } from "@/repositories/User/Plato/DeletePlatoRepository";
import { DeletePlatoService } from "@/services/User/Plato/DeletePlatoService";

// export async function GET(request, segmentData) {
//     const params = await segmentData.params
//     try {
//         const plato = await platoService.getPlatoById(params.id);
//         return NextResponse.json({ plato })
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()

    try {
        const platoRepository = new UpdatePlatoRepository();
        const platoService = new UpdatePlatoService(platoRepository);
        const plato = await platoService.execute(params.id, form);
        return NextResponse.json({ status: true, message: "Plato editado correctamente", id: plato.id, mainImage: plato.mainImageId })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}

export async function DELETE(request, segmentData) {
    const params = await segmentData.params
    try {
        const platoRepository = new DeletePlatoRepository();
        const platoService = new DeletePlatoService(platoRepository);
        await platoService.execute(params.id, async (imageUrl) => {
            await deleteImage(imageUrl);
        });
        return NextResponse.json({ status: true, message: "Eliminado correctamente" })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
