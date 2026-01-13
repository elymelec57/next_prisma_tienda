import { NextResponse } from 'next/server'
import { prisma } from '../../../../../libs/prisma.js'

export async function GET (request, { params }) {
  try {
    const ingrediente = await prisma.ingrediente.findUnique({
      where: {
        id: Number(params.id)
      }
    })
    if (!ingrediente) {
      return NextResponse.json({ error: 'Ingrediente no encontrado' }, { status: 404 })
    }
    return NextResponse.json(ingrediente)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT (request, { params }) {
  try {
    const { nombre, categoriaIngredienteId } = await request.json()
    const updatedIngrediente = await prisma.ingrediente.update({
      where: {
        id: Number(params.id)
      },
      data: {
        nombre,
        categoriaIngrediente: {
          connect: {
            id: categoriaIngredienteId
          }
        }
      }
    })
    return NextResponse.json(updatedIngrediente)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const deletedIngrediente = await prisma.ingrediente.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json(deletedIngrediente)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
