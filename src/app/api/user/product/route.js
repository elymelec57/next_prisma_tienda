import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { PlatoRepository } from '@/repositories/PlatoRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { PlatoService } from '@/services/PlatoService';

const platoRepository = new PlatoRepository();
const restaurantRepository = new RestaurantRepository();
const platoService = new PlatoService(platoRepository, restaurantRepository);

export async function GET(request) {
    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    try {
        const result = await platoService.getPlatosByRestaurant(user.auth.restauranteId);
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
