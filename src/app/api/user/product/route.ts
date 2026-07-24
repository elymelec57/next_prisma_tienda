import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { ViewPlatoService } from '@/services/User/Plato/ViewPlatoService';
import { ViewPlatoRepository } from '@/repositories/User/Plato/ViewPlatoRepository';
import { PlatoService } from '@/services/User/Plato/PlatoService';
import { PlatoRepository } from '@/repositories/User/Plato/PlatoRepository';

const viewPlatoRepository = new ViewPlatoRepository();
const viewPlatoService = new ViewPlatoService(viewPlatoRepository);

const platoRepository = new PlatoRepository();
const platoService = new PlatoService(platoRepository);

export async function GET(request: Request) {
    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url);
        const sucursalId = searchParams.get('sucursalId');
        const result = await viewPlatoService.getPlatosByRestaurant(user.auth.restaurantId, sucursalId);
        const Platos = await platoService.getPlatosByRestaurant(user.auth.restaurantId, sucursalId);
        return NextResponse.json({ platos: Platos.dataPlatos, categorias: result.categorias })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
