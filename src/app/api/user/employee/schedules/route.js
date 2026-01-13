
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { authorizeRequest } from '@/libs/auth'

export async function GET(request) {
    const user = await authorizeRequest(request)
    if (!user.authorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Si el rol es 'user' (admin), tal vez quiera filtrar por restaurante
        // Pero si es empleado, buscamos sus propios horarios
        const schedules = await prisma.empleadoHorario.findMany({
            where: {
                empleadoId: Number(user.auth.id)
            },
            orderBy: {
                startTime: 'asc'
            }
        })

        return NextResponse.json(schedules)
    } catch (error) {
        console.error('Error fetching schedules:', error)
        return NextResponse.json({ message: 'Error al obtener horarios' }, { status: 500 })
    }
}
