import { NextResponse } from 'next/server';
import { StoreContornoService } from '@/services/User/Contorno/StoreContornoService';
import { StoreContornoRepository } from '@/repositories/User/Contorno/StoreContornoRepository';

const storeContornoRepository = new StoreContornoRepository();
const storeContornoService = new StoreContornoService(storeContornoRepository);

export async function POST(request) {
    const { form, user } = await request.json();
    const userId = typeof user === 'object' ? user.auth.id : Number(user);

    try {
        await storeContornoService.execute(form, userId);
        return NextResponse.json({ status: true, message: 'Contorno creado correctamente' });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}