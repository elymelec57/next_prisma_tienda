import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma';
import { authorizeRequest } from '@/libs/auth'

export async function GET(request) {

    const user = await authorizeRequest(request)

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const platos = await prisma.plato.findMany({
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            disponible: true,
            mainImageId: true,
            categoriaId: true,
        },
        where: {
            restaurantId: user.auth.restauranteId
        },
    });

    const imageIds = platos
        .map((p) => p.mainImageId)
        .filter((id) => id !== null);

    const categorias = await prisma.categoria.findMany({
        where: {
            platos: {
                some: {
                    restaurantId: user.auth.restauranteId
                }
            }
        }
    });

    if (imageIds.length === 0) {
        // No hay imágenes para buscar, devolver solo los productos
        const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
        return NextResponse.json({ categorias, dataPlatos })
    }

    const images = await prisma.image.findMany({
        where: {
            id: {
                in: imageIds, // Filtrar por los IDs que acabamos de extraer
            },
            modelType: 'plato',
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

    return NextResponse.json({ categorias, dataPlatos })
}