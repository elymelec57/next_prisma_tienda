import { NextResponse } from "next/server"
import { BuyService } from '@/services/Platform/BuyService'
import { BuyRepository } from '@/repositories/Platform/BuyRepository'

const buyRepository = new BuyRepository();
const buyService = new BuyService(buyRepository);

export async function POST(request) {
    try {
        const { form, pago } = await request.json()

        const payment = await buyService.execute(form, pago);

        return NextResponse.json({ status: true, message: 'Orden solicitada con exito', paymentId: payment })

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ status: false, message: 'Error al procesar la orden' })
    }
}