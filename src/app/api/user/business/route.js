import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import slugify from 'slugify';

export async function POST(request) {

    const { form, userId } = await request.json()
    const slug = slugify(form.name, {
        lower: true,      // Convierte a minúsculas
        strict: true,     // Elimina caracteres no válidos
        remove: /[*+~.()'"!:@]/g // Elimina caracteres especiales
    });

    const businessCreate = await prisma.restaurant.create({
        data: {
            name: form.name,
            slogan: form.slogan,
            direcction: form.direcction,
            phone: form.phone,
            currency: form.currency || "USD",
            slug: slug,
            categoriaRestaurant: {
                connect: form.categoriaRestaurant?.map(id => ({ id: Number(id) })) || []
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            lat: form.lat ? parseFloat(form.lat) : null,
            lng: form.lng ? parseFloat(form.lng) : null,
            deliveryFreeRange: form.deliveryFreeRange ? parseFloat(form.deliveryFreeRange) : null,
            deliveryShortRange: form.deliveryShortRange ? parseFloat(form.deliveryShortRange) : null,
            deliveryShortPrice: form.deliveryShortPrice ? parseFloat(form.deliveryShortPrice) : null,
            deliveryMediumRange: form.deliveryMediumRange ? parseFloat(form.deliveryMediumRange) : null,
            deliveryMediumPrice: form.deliveryMediumPrice ? parseFloat(form.deliveryMediumPrice) : null,
            deliveryLongRange: form.deliveryLongRange ? parseFloat(form.deliveryLongRange) : null,
            deliveryLongPrice: form.deliveryLongPrice ? parseFloat(form.deliveryLongPrice) : null,
            countryId: form.countryId ? Number(form.countryId) : null,
            stateId: form.stateId ? Number(form.stateId) : null,
            cityId: form.cityId ? Number(form.cityId) : null,
        },
        include: {
            user: true,
            categoriaRestaurant: true
        },
    });

    if (businessCreate) {
        return NextResponse.json({ status: true, message: 'Business created', id: businessCreate.id })
    }

    return NextResponse.json({ status: false, message: 'Business created error' })
}