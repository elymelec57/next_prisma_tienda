
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const ingredients = await prisma.ingrediente.findMany()
    return NextResponse.json(ingredients)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const ingredient = await prisma.ingrediente.create({
      data,
    })
    return NextResponse.json(ingredient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()
    const ingredient = await prisma.ingrediente.update({
      where: { id },
      data,
    })
    return NextResponse.json(ingredient)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    await prisma.ingrediente.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Ingredient deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
