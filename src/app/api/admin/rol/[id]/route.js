import { NextResponse } from 'next/server'
import { prisma } from '../../../../../libs/prisma.js'

export async function GET (request, { params }) {
  try {
    const rol = await prisma.rol.findUnique({
      where: {
        id: Number(params.id)
      }
    })
    if (!rol) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 })
    }
    return NextResponse.json(rol)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const deletedRol = await prisma.rol.delete({
      where: {
        id: Number(params.id)
      }
    })
    return NextResponse.json({status: true})
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
