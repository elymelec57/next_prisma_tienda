import { NextResponse } from 'next/server'
import { prisma } from '../../../../../libs/prisma.js'

export async function GET (request, { params }) {
  try {
    const contorno = await prisma.contornos.findUnique({
      where: {
        id: Number(params.id)
      }
    })
    if (!contorno) {
      return NextResponse.json({ error: 'Contorno no encontrado' }, { status: 404 })
    }
    return NextResponse.json(contorno)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT (request, { params }) {
  try {
    const { nombre, price, restaurantId } = await request.json()
    const updatedContorno = await prisma.contornos.update({
      where: {
        id: Number(params.id)
      },
      data: {
        nombre,
        price,
        restaurant: {
          connect: {
            id: restaurantId
          }
        }
      }
    })
    return NextResponse.json(updatedContorno)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const deletedContorno = await prisma.contornos.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json(deletedContorno)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
