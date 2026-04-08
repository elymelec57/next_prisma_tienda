import { NextResponse } from 'next/server';
import { PlatoRepository } from '@/repositories/PlatoRepository';
import { RestaurantRepository } from '@/repositories/RestaurantRepository';
import { PlatoService } from '@/services/PlatoService';

const platoRepository = new PlatoRepository();
const restaurantRepository = new RestaurantRepository();
const platoService = new PlatoService(platoRepository, restaurantRepository);

export async function POST(request) {
    const { form, user } = await request.json()

    // user is an object containing auth data, id is user.auth.id
    const userId = typeof user === 'object' ? user.auth.id : Number(user);

    try {
        const plato = await platoService.createPlato(userId, form);
        return NextResponse.json({ status: true, message: 'Plato creado con exito', id: plato.id })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
