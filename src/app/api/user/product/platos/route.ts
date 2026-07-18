import { NextResponse } from 'next/server'
import { authorizeRequest } from '@/libs/auth'
import { PlatoRepository } from '@/repositories/User/Plato/PlatoRepository';
import { PlatoService } from '@/services/User/Plato/PlatoService';

const platoRepository = new PlatoRepository();
const platoService = new PlatoService(platoRepository);

export async function GET(request) {
    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url);
        const sucursalId = searchParams.get('sucursalId');
        const result = await platoService.getPlatosByRestaurant(user.auth.restauranteId, sucursalId);
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}