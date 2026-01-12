
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { verifyToken } from '@/libs/jwt'
import { cookies } from 'next/headers'

export async function GET () {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const user = await verifyToken(token.value)
  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: user.id }
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
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const user = await verifyToken(token.value)
  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: user.id }
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
