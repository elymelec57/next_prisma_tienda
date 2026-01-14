import { NextResponse } from 'next/server'
import { prisma } from '../../../../../libs/prisma.js'

export async function GET (request, { params }) {
  try {
    const categoria = await prisma.categoriaIngrediente.findUnique({
      where: {
        id: Number(params.id)
      }
    })
    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }
    return NextResponse.json(categoria)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const deletedCategoria = await prisma.categoriaIngrediente.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
