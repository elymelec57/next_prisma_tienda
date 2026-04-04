import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const categorias = await prisma.categoria.findMany()
    return NextResponse.json({status: true, categorias})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const data = await request.json()
    const newCategoria = await prisma.categoria.create({
      data: {
        nombre: data.name
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT (request) {
  try {
    const data = await request.json()
    const updatedCategoria = await prisma.categoria.update({
      where: {
        id: data.id
      },
      data: {
        nombre: data.name
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
