
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')

        if (!categoryId) {
            const ingredients = await prisma.ingrediente.findMany({
                orderBy: { nombre: 'asc' }
            })
            return NextResponse.json(ingredients)
        }

        const ingredients = await prisma.ingrediente.findMany({
            where: { categoriaIngredienteId: parseInt(categoryId) },
            orderBy: { nombre: 'asc' }
        })
        return NextResponse.json(ingredients)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
