import { prisma } from '@/libs/prisma'
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const id = searchParams.get('id');

  const blob = await put(filename, request.body, {
    access: 'public',
    addRandomSuffix: true,
  });

  const newImage = await prisma.image.create({
    data: {
      url: blob.pathname,
      modelId: String(id),
      modelType: 'Plato', // Indica el modelo padre
      altText: 'Imagen que pertenece al plato',
    },
  });

  if (newImage) {
    await prisma.plato.update({
      where: { id: Number(id) },
      data: { mainImageId: newImage.id },
    });

    return NextResponse.json({ status: true, message: 'Plato creado con exito' })
  }

  return NextResponse.json({ status: true, message: 'Se creo el plato pero error al guardar la imagen' });
}