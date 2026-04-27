import { cache } from 'react'
import { prisma } from './prisma'

// getPost will be used twice, but execute only once
export const ProductsData = cache(async ({ id, categoryId, sucursalId, skip = 0, take = 6 }) => {

    const platos = await prisma.plato.findMany({
        where: {
            restaurant: {
                id: Number(id)
            },
            ...(categoryId && { categoriaId: Number(categoryId) }),
            ...(sucursalId && {
                sucursales: {
                    some: {
                        id: Number(sucursalId)
                    }
                }
            })
        },
        include: {
            contornos: true
        },
        skip: skip,
        take: take,
        orderBy: {
            id: 'desc'
        }
    })

    const imageIds = platos
        .map((p) => p.mainImageId)
        .filter((id) => id !== null);

    if (imageIds.length === 0) {
        // No hay imágenes para buscar, devolver solo los productos
        const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
        return dataPlatos
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

    return dataPlatos
})