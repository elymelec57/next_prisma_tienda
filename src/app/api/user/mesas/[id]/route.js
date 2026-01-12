import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { authorizeRequest }  from '@/libs/auth'

export async function PUT (request, { params }) {

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
    const updatedMesa = await prisma.mesa.update({
      where: { id: Number(params.id), restaurantId: restaurant.id },
      data
    })

    return NextResponse.json(updatedMesa)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating mesa' }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {

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

    await prisma.mesa.delete({
      where: { id: Number(params.id), restaurantId: restaurant.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting mesa' }, { status: 500 })
  }
}
