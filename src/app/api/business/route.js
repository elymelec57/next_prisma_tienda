import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import { prisma } from "@/libs/prisma";
import slugify from 'slugify';

export async function POST(request) {

    const { form, userId } = await request.json()

    const nameImg = Date.now() + '.jpg';
    let imageData = form.logo;
    let pathImage = path.join(process.cwd(), 'public/images/business/');
    let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(pathImage + nameImg, base64Data, { encoding: 'base64' });

    const slug = slugify(form.name, {
        lower: true,      // Convierte a minúsculas
        strict: true,     // Elimina caracteres no válidos
        remove: /[*+~.()'"!:@]/g // Elimina caracteres especiales
    });

    const businessCreate = await prisma.business.create({
        data: {
            name: form.name,
            slogan: form.slogan,
            direcction: form.direcction,
            phone: form.phone,
            logo: nameImg,
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
        return NextResponse.json({ status: true, message: 'Business created' })
    }

    return NextResponse.json({ status: false, message: 'Business created error'  })
}