import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma';

export async function GET(request, segmentData) {

    const params = await segmentData.params

    const rest = await prisma.restaurant.findUnique({
        where: {
            userId: Number(params.id)
        },
        select: {
            id: true
        }
    })

    const platos = await prisma.plato.findMany({
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            disponible: true,
            mainImageId: true,
        },
        where: {
            restaurantId: Number(rest.id)
        },
    });

    const imageIds = platos
        .map((p) => p.mainImageId)
        .filter((id) => id !== null);

    if (imageIds.length === 0) {
        // No hay imágenes para buscar, devolver solo los productos
        const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
        return NextResponse.json({ dataPlatos })
    }

    const images = await prisma.image.findMany({
        where: {
            id: {
                in: imageIds, // Filtrar por los IDs que acabamos de extraer
            },
            modelType: 'Plato',
        },
        select: {
            id: true, // Incluir el ID para mapear
            url: true,
            //altText: true,
        },
    });

    // 4. Mapear las imágenes a los productos
    const imageMap = new Map(images.map((img) => [img.id, img]));

    const dataPlatos = platos.map((plato) => ({
        ...plato,
        mainImage: plato.mainImageId ? imageMap.get(plato.mainImageId) : null,
    }));
    return NextResponse.json({ dataPlatos })
}