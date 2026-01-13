import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'

export async function GET () {
  try {
    const roles = await prisma.rol.findMany()
    return NextResponse.json(roles)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const { nombre } = await request.json()
    const newRol = await prisma.rol.create({
      data: {
        nombre
      }
    })
    return NextResponse.json(newRol)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
