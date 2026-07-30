import { NextResponse } from "next/server"
import { BuyService } from '@/services/Platform/BuyService'
import { BuyRepository } from '@/repositories/Platform/BuyRepository'
import { SaveImageVercelService } from "@/services/Platform/File/SaveImageVercelService";

const buyRepository = new BuyRepository();
const saveImageVercelService = new SaveImageVercelService();
const buyService = new BuyService(buyRepository, saveImageVercelService);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const formStr = formData.get('form') as string;
        const form = formStr ? JSON.parse(formStr) : null;
        const pago = formData.get('pago');
        const comprobante = formData.get('comprobante'); // Esto ahora sí será un objeto File

        const payment = await buyService.execute(form, pago, comprobante);

        return NextResponse.json({ status: true, message: 'Orden solicitada con exito', paymentId: payment })

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ status: false, message: 'Error al procesar la orden' })
    }
}