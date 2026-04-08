import { NextResponse } from "next/server";
import deleteImage from "@/libs/deleteImage";
import { PlatoRepository } from '@/repositories/PlatoRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { PlatoService } from '@/services/PlatoService';

const platoRepository = new PlatoRepository();
const restaurantRepository = new RestaurantRepository();
const platoService = new PlatoService(platoRepository, restaurantRepository);

export async function GET(request, segmentData) {
    const params = await segmentData.params
    try {
        const plato = await platoService.getPlatoById(params.id);
        return NextResponse.json({ plato })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()

    try {
        const plato = await platoService.updatePlato(params.id, form);
        return NextResponse.json({ status: true, message: "Plato editado correctamente", id: plato.id, mainImage: plato.mainImageId })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}

export async function DELETE(request, segmentData) {
    const params = await segmentData.params
    try {
        await platoService.deletePlato(params.id, async (imageUrl) => {
            await deleteImage(imageUrl);
        });
        return NextResponse.json({ status: true, message: "Eliminado correctamente" })
    } catch (error) {
        console.log("Error:", error)
        return NextResponse.json({ status: false, message: error.message })
    }
}
