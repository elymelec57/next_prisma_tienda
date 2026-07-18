import { NextResponse } from 'next/server';
import { StorePlatoService } from '@/services/User/Plato/StorePlatoService';
import { StorePlatoRepository } from '@/repositories/User/Plato/StorePlatoRepository';

const storePlatoRepository = new StorePlatoRepository();
const storePlatoService = new StorePlatoService(storePlatoRepository);

export async function POST(request) {
    const { form, user } = await request.json()
    // user is an object containing auth data, id is user.auth.id
    const userId = typeof user === 'object' ? user.auth.id : Number(user);
    try {
        const plato = await storePlatoService.execute(form, userId);
        return NextResponse.json({ status: true, message: 'Plato creado con exito', id: plato.id })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
