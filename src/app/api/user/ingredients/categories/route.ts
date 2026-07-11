
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
    try {
        const categories = await prisma.categoriaIngrediente.findMany({
            orderBy: { nombre: 'asc' }
        })
        return NextResponse.json(categories)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
