import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { ViewPlatoService } from '@/services/User/Plato/ViewPlatoService';
import { ViewPlatoRepository } from '@/repositories/User/Plato/ViewPlatoRepository';

const viewPlatoRepository = new ViewPlatoRepository();
const viewPlatoService = new ViewPlatoService(viewPlatoRepository);

export async function GET(request) {
    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    try {
        const result = await viewPlatoService.getPlatosByRestaurant(user.auth.restauranteId);
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
