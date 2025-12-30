import { prisma } from '@/libs/prisma'
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const model = searchParams.get('model');
  const id = searchParams.get('id');

  const blob = await put(filename, request.body, {
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
}