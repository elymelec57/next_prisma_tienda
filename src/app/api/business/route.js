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
            slug: slug,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
        include: {
            user: true,
        },
    });

    if (businessCreate) {
        return NextResponse.json({ status: true, message: 'Business created', id: businessCreate.id })
    }

    return NextResponse.json({ status: false, message: 'Business created error' })
}