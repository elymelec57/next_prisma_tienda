import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { ImportPlatoRepository } from '@/repositories/User/Product/ImportPlatoRepository';
import { ImportPlatoService } from '@/services/User/Product/ImportPlatoService';
import { createAiProvider } from '@/services/AI/AiProviderFactory';

const importRepository = new ImportPlatoRepository();
const importService = new ImportPlatoService(importRepository, createAiProvider());

export async function POST(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const rawSucursalId = formData.get('sucursalId');
        const sucursalId = rawSucursalId && rawSucursalId !== 'main' ? Number(rawSucursalId) : null;

        if (!file) {
            return NextResponse.json({ status: false, message: 'No se envio ningun archivo' });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ status: false, message: 'El archivo supera los 10MB' });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const job = await importService.startImport({
            userId: user.auth.id,
            fileName: file.name,
            fileBuffer: buffer,
            sucursalId,
        });

        return NextResponse.json({
            status: true,
            message: 'Importacion iniciada en segundo plano',
            jobId: job.id,
            totalRows: job.totalRows,
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
        const jobs = await importService.listJobs(user.auth.restaurantId, limit);
        return NextResponse.json({ status: true, jobs });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}