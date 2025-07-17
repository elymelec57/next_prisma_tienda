import { NextResponse } from 'next/server'
import path from 'path';
import fs from 'fs';
import { prisma } from '@/libs/prisma';

export async function POST(request) {

    const { form } = await request.json()
    
    const nameImg = Date.now() + '.jpg';
    let imageData = form.image;
    let pathImage = path.join(process.cwd(), 'public/images/');
    let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(pathImage + nameImg, base64Data, { encoding: 'base64' });

    const product = await prisma.product.create({
        data: {
            name: form.name,
            description: form.description,
            price: form.price,
            image: nameImg,
            user: {
                connect: {
                    id: form.userId,
                },
            },
        },
        include: {
            user: true,
        },
    })

    if(product){
        return NextResponse.json({ status: true, message: 'Product created' })
    }
    return NextResponse.json({ status: false, message: 'Product Error' })
}