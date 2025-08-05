import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server"
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export async function GET(request, segmentData) {
    const params = await segmentData.params;

    const business = await prisma.business.findUnique({
        where: {
            userId: Number(params.id)
        }
    })

    return NextResponse.json({ status: true, business })
}

export async function PUT(request, segmentData) {

    const { form } = await request.json()
    const params = await segmentData.params

    const slug = slugify(form.name, {
        lower: true,      // Convierte a minúsculas
        strict: true,     // Elimina caracteres no válidos
        remove: /[*+~.()'"!:@]/g // Elimina caracteres especiales
    });

    let businessupdate = '';

    if (form.logo) {
        const nameImg = Date.now() + '.jpg';
        let imageData = form.logo;
        let pathImage = path.join(process.cwd(), 'public/images/business/');
        let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        sharp(buffer)
            .resize(500, 500)
            .jpeg({ mozjpeg: true })
            .toBuffer()
            .then(data => {
                fs.writeFileSync(pathImage + nameImg, data);
            })
            .catch(err => {
                console.log(err, 'errors')
            });
        //fs.writeFileSync(pathImage + nameImg, base64Data, { encoding: 'base64' });

        // delete imagen file
        fs.unlinkSync(pathImage + form.logoCurrent)

        businessupdate = await prisma.business.update({
            where: {
                userId: Number(params.id)
            },
            data: {
                name: form.name,
                slogan: form.slogan,
                direcction: form.direcction,
                phone: form.phone,
                logo: nameImg,
                slug: slug,
            },
        });
    } else {
        businessupdate = await prisma.business.update({
            where: {
                userId: Number(params.id)
            },
            data: {
                name: form.name,
                slogan: form.slogan,
                direcction: form.direcction,
                phone: form.phone,
                slug: slug,
            },
        });
    }

    if (businessupdate) {
        return NextResponse.json({ status: true, message: 'Business updated' })
    }

    return NextResponse.json({ status: false, message: 'Business updated error' })
}