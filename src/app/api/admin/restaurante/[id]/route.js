import { NextResponse } from 'next/server'
import { prisma } from '../../../../../libs/prisma.js'

export async function GET (request, { params }) {
  try {
    const restaurante = await prisma.restaurant.findUnique({
      where: {
        id: Number(params.id)
      }
    })
    if (!restaurante) {
      return NextResponse.json({ error: 'Restaurante no encontrado' }, { status: 404 })
    }
    return NextResponse.json(restaurante)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const deletedRestaurante = await prisma.restaurant.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
