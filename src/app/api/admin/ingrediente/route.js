import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const ingredientes = await prisma.ingrediente.findMany({
      include:{
        categoriaIngrediente: true
      }
    })
    return NextResponse.json({status: true, ingredientes})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { nombre, categoriaIngredienteId } = await request.json()
    const newIngrediente = await prisma.ingrediente.create({
      data: {
        nombre,
        categoriaIngrediente: {
          connect: {
            id: categoriaIngredienteId
          }
        }
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT (request) {
  try {
    const { nombre, categoriaIngredienteId, id } = await request.json()
    
    const updatedIngrediente = await prisma.ingrediente.update({
      where: {
        id: id
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
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
