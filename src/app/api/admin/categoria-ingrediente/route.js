import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const categorias = await prisma.categoriaIngrediente.findMany()
    return NextResponse.json(categorias)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { nombre } = await request.json()
    const newCategoria = await prisma.categoriaIngrediente.create({
      data: {
        nombre
      }
    })
    return NextResponse.json(newCategoria)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
