import { NextResponse } from 'next/server';
import { ContornoRepository } from '@/repositories/User/Contorno/ContornoRepository';
import { ContornoService } from '@/services/User/Contorno/ContornoService';
import { UpdateContornoRepository } from '@/repositories/User/Contorno/UpdateContornoRepository';
import { UpdateContornoService } from '@/services/User/Contorno/UpdateContornoService';
import { DeleteContornoRepository } from '@/repositories/User/Contorno/DeleteContornoRepository';
import { DeleteContornoService } from '@/services/User/Contorno/DeleteContornoService';

export async function GET(request, segmentData) {
    const params = await segmentData.params;
    try {
        const contornoRepository = new ContornoRepository();
        const contornoService = new ContornoService(contornoRepository);

        const result = await contornoService.getContornoById(params.id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, segmentData) {
    const params = await segmentData.params;
    const { form } = await request.json();

    try {
        const contornoRepository = new UpdateContornoRepository();
        const contornoService = new UpdateContornoService(contornoRepository);
        const contorno = await contornoService.execute(params.id, form);
        return NextResponse.json({ status: true, message: 'Contorno editado correctamente', id: contorno.id });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function DELETE(request, segmentData) {
    const params = await segmentData.params;
    try {
        const contornoRepository = new DeleteContornoRepository();
        const contornoService = new DeleteContornoService(contornoRepository);
        await contornoService.execute(params.id);
        return NextResponse.json({ status: true, message: 'Eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}