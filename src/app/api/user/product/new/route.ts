import { NextResponse } from 'next/server';
import { StorePlatoService } from '@/services/User/Plato/StorePlatoService';
import { StorePlatoRepository } from '@/repositories/User/Plato/StorePlatoRepository';
import { authorizeRequest } from '@/libs/auth';
import { SaveImageVercelService } from '@/services/Shared/File/SaveImageVercelService';

const storePlatoRepository = new StorePlatoRepository();
const saveImageVercelService = new SaveImageVercelService();
const storePlatoService = new StorePlatoService(storePlatoRepository, saveImageVercelService);

export async function POST(request) {

    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const formData = await request.formData();
    const form = JSON.parse(formData.get('form'));
    const userId = user.auth.id;

    try {
        const plato = await storePlatoService.execute(form, userId, formData.get('image'));
        return NextResponse.json({ status: true, message: 'Plato creado con exito', id: plato.id })
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message })
    }
}
