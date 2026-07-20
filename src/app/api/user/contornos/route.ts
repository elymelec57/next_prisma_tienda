import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { ContornoRepository } from '@/repositories/User/Contorno/ContornoRepository';
import { ContornoService } from '@/services/User/Contorno/ContornoService';

const contornoRepository = new ContornoRepository();
const contornoService = new ContornoService(contornoRepository);

export async function GET(request) {
    const user = await authorizeRequest(request);
    const searchParams = request.nextUrl.searchParams;
    const sucursalId = searchParams.get('sucursalId');

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const result = await contornoService.getContornosByRestaurant(user.auth.restaurantId, sucursalId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
