
import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { AllOrderOnlineRepository } from '@/repositories/User/Order/AllOrderOnlineRepository'
import { AllOrderOnlineService } from '@/services/User/Order/AllOrderOnlineService'
import { CreateOrderRepository } from '@/repositories/User/Order/CreateOrderRepository'
import { CreateOrderService } from '@/services/User/Order/CreateOrderService'

const allOrderOnlineRepository = new AllOrderOnlineRepository()
const allOrderOnlineService = new AllOrderOnlineService(allOrderOnlineRepository)

const createOrderRepository = new CreateOrderRepository()
const createOrderService = new CreateOrderService(createOrderRepository)

export async function GET(request) {
    const user = await authorizeRequest(request)
    const sucursalId = request.nextUrl.searchParams.get('sucursalId')

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const orders = await allOrderOnlineService.execute(user.auth.restaurantId, sucursalId);
    return NextResponse.json({ status: true, orders })
}

export async function POST(request) {
    const user = await authorizeRequest(request)
    if (!user.authorized) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { restaurantId, sucursalId, clienteId, nombreCliente, total, estado, mesaId, items } = await request.json()

        const order = await createOrderService.execute({
            restaurantId: Number(restaurantId),
            sucursalId: Number(sucursalId) || null,
            clienteId: clienteId ? Number(clienteId) : null,
            nombreCliente: nombreCliente || null,
            total: parseFloat(total),
            estado: estado || 'Pendiente',
            mesaId: Number(mesaId),
            empleadoId: user.auth.role !== 'user' ? Number(user.auth.id) : null,
            items: items.map((item) => ({
                platoId: Number(item.platoId),
                cantidad: Number(item.cantidad),
                precioUnitario: parseFloat(item.precioUnitario),
                nota: item.nota || '',
            })),
        })

        return NextResponse.json({ status: true, order }, { status: 201 })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json({ message: 'Error al crear el pedido', error: error.message }, { status: 500 })
    }
}
