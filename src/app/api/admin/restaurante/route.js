import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const restaurantes = await prisma.restaurant.findMany()
    return NextResponse.json(restaurantes)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { slug, name, slogan, phone, direcction, userId, categoriaRestaurant, paymentMethods } = await request.json()
    const newRestaurante = await prisma.restaurant.create({
      data: {
        slug,
        name,
        slogan,
        phone,
        direcction,
        user: {
          connect: {
            id: userId
          }
        },
        categoriaRestaurant: {
          connect: categoriaRestaurant.map(id => ({ id }))
        },
        paymentMethods: {
          connect: paymentMethods.map(id => ({ id }))
        }
      }
    })
    return NextResponse.json(newRestaurante)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
