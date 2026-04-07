import { prisma } from '@/libs/prisma'
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const model = searchParams.get('model');
  const id = searchParams.get('id');

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
        altText: 'Imagen que pertenece al ' + model,
      },
    });

    if (newImage) {
      await prisma[model].update({
        where: { id: Number(id) },
        data: { mainImageId: newImage.id },
      });

      return NextResponse.json({ status: true, message: 'creado con exito' })
    }

    return NextResponse.json({ status: false, message: 'Error al guardar la imagen, pero se guardo el registro' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ status: false, message: 'Error al procesar la imagen' }, { status: 500 });
  }
}
