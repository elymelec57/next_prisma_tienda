import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { ContornoRepository } from '@/repositories/User/Contorno/ContornoRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { ContornoService } from '@/services/User/Contorno/ContornoService';

const contornoRepository = new ContornoRepository();
const restaurantRepository = new RestaurantRepository();
const contornoService = new ContornoService(contornoRepository, restaurantRepository);

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const result = await contornoService.getContornosByRestaurant(user.auth.restauranteId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
