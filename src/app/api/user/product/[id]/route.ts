import { NextResponse } from "next/server";
import deleteImage from "@/libs/deleteImage";
import { UpdatePlatoRepository } from "@/repositories/User/Plato/UpdatePlatoRepository";
import { UpdatePlatoService } from "@/services/User/Plato/UpdatePlatpService";
import { DeletePlatoRepository } from "@/repositories/User/Plato/DeletePlatoRepository";
import { DeletePlatoService } from "@/services/User/Plato/DeletePlatoService";
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";
import { authorizeRequest } from "@/libs/auth";

const saveImageVercelService = new SaveImageVercelService();

export async function PUT(request, segmentData) {

    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const params = await segmentData.params
    const formData = await request.formData();
    const form = JSON.parse(formData.get("form"));
    const mainImageId = formData.get("mainImageId");
    try {
        const platoRepository = new UpdatePlatoRepository();
        const platoService = new UpdatePlatoService(platoRepository, saveImageVercelService);
        const plato = await platoService.execute(params.id, form, formData.get("image"), mainImageId);
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
