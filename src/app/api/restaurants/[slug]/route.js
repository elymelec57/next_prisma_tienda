import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, { params }) {
    try {
        const { slug } = await params;

        const restaurant = await prisma.restaurant.findFirst({
            where: { slug: slug },
            include: {
                paymentMethods: {
                    where: { isActive: true }
                },
                restaurantHours: true
            }
        });

        if (!restaurant) {
            return NextResponse.json({ status: false, message: 'Restaurante no encontrado' }, { status: 404 });
        }

        // Get logo if exists
        let logoUrl = null;
        if (restaurant.mainImageId) {
            const logo = await prisma.image.findFirst({
                where: { id: restaurant.mainImageId },
                select: { url: true }
            });
            if (logo) logoUrl = logo.url;
        }

        return NextResponse.json({
            status: true,
            restaurant: {
                ...restaurant,
                logo: logoUrl
            }
        });

    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
