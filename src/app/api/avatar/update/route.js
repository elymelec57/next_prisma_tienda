import { prisma } from '@/libs/prisma'
import { put } from '@vercel/blob';
import deleteImage from "@/libs/deleteImage";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const id = searchParams.get('id');
  const mainImage = searchParams.get('mainImage')

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

    // elimino la imagen anterior a la actualizacion y el registro en la base de datos
    const imageLast = await prisma.image.delete({
        where:{
            id: mainImage
        }
    })
    await deleteImage(imageLast.url)

    return NextResponse.json({ status: true, message: 'Plato creado con exito' })
  }

  return NextResponse.json({ status: true, message: 'Se creo el plato pero error al guardar la imagen' });
}