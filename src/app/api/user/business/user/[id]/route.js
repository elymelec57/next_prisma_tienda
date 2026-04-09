import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server"
import slugify from 'slugify';

export async function GET(request, segmentData) {
    const params = await segmentData.params;

    const rest = await prisma.restaurant.findUnique({
        where: {
            userId: Number(params.id)
        },
        include: {
            restaurantHours: {
                orderBy: {
                    dayOfWeek: 'asc'
                }
            },
            paymentMethods: true,
            categoriaRestaurant: true
        }
    })

    if (!rest) {
        return NextResponse.json({ status: false, message: 'Business not found' })
    }

    if (rest.mainImageId != null) {
        const image = await prisma.image.findUnique({
            where: {
                id: rest.mainImageId
            },
            select: {
                id: true,
                url: true
            }
        });
        rest.url = image.url
    } else {
        rest.url = null
    }

    return NextResponse.json({ status: true, rest })
}

export async function PUT(request, segmentData) {

    const { form } = await request.json()
    const params = await segmentData.params

    const slug = slugify(form.name, {
        lower: true,      // Convierte a minúsculas
        strict: true,     // Elimina caracteres no válidos
        remove: /[*+~.()'"!:@]/g // Elimina caracteres especiales
    });

    const businessupdate = await prisma.restaurant.update({
        where: {
            userId: Number(params.id)
        },
        data: {
            name: form.name,
            slogan: form.slogan,
            direcction: form.direcction,
            phone: form.phone,
            currency: form.currency,
            slug: slug,
            categoriaRestaurant: {
                set: form.categoriaRestaurant?.map(id => ({ id: Number(id) })) || []
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
    });

    if (businessupdate) {
        return NextResponse.json({ status: true, message: 'Business updated', id: businessupdate.id, mainImage: businessupdate.mainImageId })
    }

    return NextResponse.json({ status: false, message: 'Business updated error' })
}