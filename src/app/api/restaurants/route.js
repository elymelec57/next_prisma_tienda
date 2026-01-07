import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET() {
    try {
        const restaurant = await prisma.restaurant.findMany();
        let dataRest;
        const imageIds = restaurant
            .map((r) => r.mainImageId)
            .filter((id) => id !== null);

        if (imageIds.length === 0) {
            dataRest = restaurant.map((r) => ({ ...r, mainImage: null }));
        } else {
            const images = await prisma.image.findMany({
                where: {
                    id: {
                        in: imageIds,
                    },
                    modelType: 'restaurant',
                },
                select: {
                    id: true,
                    url: true,
                },
            });

            const imageMap = new Map(images.map((img) => [img.id, img]));

            dataRest = restaurant.map((r) => ({
                ...r,
                mainImage: r.mainImageId ? imageMap.get(r.mainImageId) : null,
            }));
        }

        return NextResponse.json(dataRest);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
