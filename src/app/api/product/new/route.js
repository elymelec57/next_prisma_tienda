import { NextResponse } from 'next/server'
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { prisma } from '@/libs/prisma';

export async function POST(request) {

    const { form, image } = await request.json()

    // const nameImg = Date.now() + '.jpg';
    // let imageData = form.image;
    // let pathImage = path.join(process.cwd(), 'public/images/');
    // let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    // const buffer = Buffer.from(base64Data, 'base64');
    
    // sharp(buffer)
    //     .resize(500,500)
    //     .jpeg({ mozjpeg: true })
    //     .toBuffer()
    //     .then(data => {
    //         fs.writeFileSync(pathImage + nameImg, data);
    //     })
    //     .catch(err => {
    //         console.log(err, 'errors')
    //     });

    const product = await prisma.product.create({
        data: {
            name: form.name,
            description: form.description,
            price: form.price,
            image: image,
            user: {
                connect: {
                    id: form.userId,
                },
            },
            category: {
                connect:{
                    id: Number(form.categoryId),
                }
            }
        },
        include: {
            user: true,
            category: true,
        },
    });

    if (product) {
        return NextResponse.json({ status: true, message: 'Product created' })
    }
    return NextResponse.json({ status: false, message: 'Product Error' })
}