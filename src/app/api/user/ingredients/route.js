
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

async function getRestaurantId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return decoded.data.restauranteId
  } catch (err) {
    return null
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const restaurantId = await getRestaurantId()

    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (id) {
      const ingredient = await prisma.ingredienteRestaurante.findUnique({
        where: { id: parseInt(id), restaurantId },
      })
      if (ingredient) {
        ingredient.costoUnitario = Number(ingredient.costoUnitario)
      }
      return NextResponse.json(ingredient)
    }

    const ingredients = await prisma.ingredienteRestaurante.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' }
    })

    const serialized = ingredients.map(ing => ({
      ...ing,
      costoUnitario: Number(ing.costoUnitario),
      stockActual: Number(ing.stockActual),
      stockMinimo: Number(ing.stockMinimo),
      stockMaximo: ing.stockMaximo ? Number(ing.stockMaximo) : null
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const restaurantId = await getRestaurantId()
    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const ingredient = await prisma.ingredienteRestaurante.create({
      data: {
        nombre: data.nombre,
        categoria: data.categoria,
        sku: data.sku,
        unidadMedida: data.unidadMedida,
        restaurantId,
        costoUnitario: parseFloat(data.costoUnitario) || 0,
        stockActual: parseFloat(data.stockActual) || 0,
        stockMinimo: parseFloat(data.stockMinimo) || 0,
        stockMaximo: data.stockMaximo ? parseFloat(data.stockMaximo) : null,
        fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
      },
    })
    return NextResponse.json(ingredient, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const restaurantId = await getRestaurantId()

    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const ingredient = await prisma.ingredienteRestaurante.update({
      where: { id: parseInt(id), restaurantId },
      data: {
        nombre: data.nombre,
        categoria: data.categoria,
        sku: data.sku,
        unidadMedida: data.unidadMedida,
        costoUnitario: parseFloat(data.costoUnitario) || 0,
        stockActual: parseFloat(data.stockActual) || 0,
        stockMinimo: parseFloat(data.stockMinimo) || 0,
        stockMaximo: data.stockMaximo ? parseFloat(data.stockMaximo) : null,
        fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : null,
      },
    })
    return NextResponse.json(ingredient)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const restaurantId = await getRestaurantId()

    if (!restaurantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.ingredienteRestaurante.delete({
      where: { id: parseInt(id), restaurantId },
    })
    return NextResponse.json({ message: 'Ingredient deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
