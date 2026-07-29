import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { PayOrderRepository } from '@/repositories/User/Caja/PayOrderRepository';
import { PayOrderService } from '@/services/User/Caja/PayOrderService';

export async function POST(request: Request) {
    try {
        const user = await authorizeRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { orderId, paymentMethodId, monto } = await request.json();

        const repository = new PayOrderRepository();
        const service = new PayOrderService(repository);

        const result = await service.execute({
            orderId,
            paymentMethodId,
            monto,
            restaurantId: user.auth.restaurantId,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
