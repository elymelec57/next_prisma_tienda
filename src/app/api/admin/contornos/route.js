import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const contornos = await prisma.contornos.findMany()
    return NextResponse.json(contornos)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { nombre, price, restaurantId } = await request.json()
    const newContorno = await prisma.contornos.create({
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
    return NextResponse.json(newContorno)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
