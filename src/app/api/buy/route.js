import { NextResponse } from "next/server"
import { prisma } from '@/libs/prisma'
import path from 'path';
import fs from 'fs';
import { BusinessData } from '@/libs/BusinessData';
import sharp from 'sharp';

export async function POST(request) {
    const { form, pago } = await request.json()
    const business = await BusinessData(form.slug)

    // const nameImg = Date.now() + '.jpg';
    // let imageData = form.comprobante;
    // let pathImage = path.join(process.cwd(), 'public/images/pagos/');
    // let base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    // const buffer = Buffer.from(base64Data, 'base64');

    // sharp(buffer)
    //     .resize(500, 500)
    //     .jpeg({ mozjpeg: true })
    //     .toBuffer()
    //     .then(data => {
    //         fs.writeFileSync(pathImage + nameImg, data);
    //     })
    //     .catch(err => {
    //         console.log(err, 'errors')
    //     });

    const order = await prisma.pedido.create({
        data: {
            order: form.order,
            priceFull: form.total,
            status: false,
            comprobante: pago,
            user: {
                connect: {
                    id: business.userId,
                },
            },
        }
    })

    const cliente = await prisma.client.create({
        data: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            business: {
                connect: {
                    id: business.id,
                },
            },
            pedido: {
                connect: {
                    id: order.id,
                },
            },
        }
    })

    if(cliente){
        return NextResponse.json({ status: true, message: 'Orden solicitado con exito' })
    }
    return NextResponse.json({ status: false, message: 'Error en la compra' })
}