import { prisma } from '@/libs/prisma'
import { put } from '@vercel/blob';
import deleteImage from "@/libs/deleteImage";
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const model = searchParams.get('model');
  const id = searchParams.get('id');
  const mainImage = searchParams.get('mainImage')

  try {
    const buffer = Buffer.from(await request.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp().toBuffer();
    const webpFilename = filename.replace(/\.[^/.]+$/, "") + ".webp";

    const blob = await put(webpFilename, webpBuffer, {
      access: 'public',
      addRandomSuffix: true,
    });

    const newImage = await prisma.image.create({
      data: {
        url: blob.pathname,
        modelId: String(id),
        modelType: model, // Indica el modelo padre
        altText: 'Imagen que pertenece al plato',
      },
    });

    if (newImage) {
      await prisma[model].update({
        where: { id: Number(id) },
        data: { mainImageId: newImage.id },
      });

      // elimino la imagen anterior a la actualizacion y el registro en la base de datos
      const imageLast = await prisma.image.delete({
        where: {
          id: mainImage
        }
      })
      await deleteImage(imageLast.url)

      return NextResponse.json({ status: true, message: `${model} creado con exito` })
    }

    return NextResponse.json({ status: true, message: `Se creo el ${model} pero error al guardar la imagen` });
  } catch (error) {
    console.error('Update image error:', error);
    return NextResponse.json({ status: false, message: 'Error al procesar la imagen' }, { status: 500 });
  }
}
