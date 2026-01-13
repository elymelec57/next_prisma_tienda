
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

async function getRestaurantId() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        return decoded.data.restauranteId
    } catch (err) {
        return null
    }
}

export async function GET() {
    try {
        const restaurantId = await getRestaurantId()
        if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Pedidos que no han sido pagados
        const orders = await prisma.pedido.findMany({
            where: {
                restaurantId,
                estado: { not: 'Pagado' }
            },
            include: {
                cliente: true,
                mesa: true,
                items: {
                    include: {
                        plato: true
                    }
                },
                Payment: true
            },
            orderBy: { fechaHora: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
