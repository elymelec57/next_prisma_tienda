import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET(request, segmentData) {
    const params = await segmentData.params
    const plato = await prisma.plato.findUnique({
        where: {
            id: Number(params.id)
        }
    });

    if (plato.mainImageId != null) {
        const image = await prisma.image.findUnique({
            where: {
                id: plato.mainImageId
            },
            select: {
                id: true,
                url: true
            }
        });
        plato.url = image.url
    }else{
         plato.url = null
    }
   
    return NextResponse.json({ plato })
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params
    const { form } = await request.json()
    let product = ''

    if (form.image) {

        const nameImg = Date.now() + '.jpg';
        let imageData = form.image;
        let pathImage = path.join(process.cwd(), 'public/images/');
        let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(pathImage + nameImg, base64Data, { encoding: 'base64' });

        // delete imagen file
        fs.unlinkSync(pathImage + form.imageCurrent)
        product = await prisma.product.update({
            where: {
                id: Number(params.id)
            },
            data: {
                name: form.name,
                description: form.description,
                price: form.price,
                categoryId: Number(form.categoryId),
                image: nameImg
            }
        });
    } else {
        product = await prisma.product.update({
            where: {
                id: Number(params.id)
            },
            data: {
                name: form.name,
                description: form.description,
                price: form.price,
                categoryId: Number(form.categoryId),
            }
        });
    }

    if (product) {
        return NextResponse.json({ status: true, product })
    }
    return NextResponse.json({ status: false, product })
}

export async function DELETE(request, segmentData) {
    const params = await segmentData.params

    const productDelete = await prisma.product.findUnique({
        where: {
            id: Number(params.id)
        },
        select: {
            image: true
        }
    });

    let pathImage = path.join(process.cwd(), 'public/images/');
    // delete imagen file
    fs.unlinkSync(pathImage + productDelete.image)

    const product = await prisma.product.delete({
        where: {
            id: Number(params.id)
        },
    });

    if (product) {
        return NextResponse.json({ status: true, product })
    } else {
        return NextResponse.json({ status: false, message: 'Error delete image' })
    }
}