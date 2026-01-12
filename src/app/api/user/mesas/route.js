
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma';
import { authorizeRequest }  from '@/libs/auth'

export async function GET (request) {

  const user = await authorizeRequest(request)
  
  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: user.auth.restauranteId }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const mesas = await prisma.mesa.findMany({
      where: { restaurantId: restaurant.id }
    })

    return NextResponse.json(mesas)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching mesas' }, { status: 500 })
  }
}

export async function POST (request) {

  const user = await authorizeRequest(request)

  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: user.auth.id }
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const data = await request.json()

    const newMesa = await prisma.mesa.create({
      data: {
        ...data,
        restaurantId: restaurant.id
      }
    })

    return NextResponse.json(newMesa)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating mesa' }, { status: 500 })
  }
}
