import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET() {
  try {
    const roles = await prisma.rol.findMany()
    return NextResponse.json({ status: true, roles })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()
    const newRol = await prisma.rol.create({
      data: {
        name
      }
    })
    return NextResponse.json({ status: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, id } = await request.json()
    const updatedRol = await prisma.rol.update({
      where: {
        id: id
      },
      data: {
        name
      }
    })
    return NextResponse.json({ status: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
