import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { ImportPlatoRepository } from '@/repositories/User/Product/ImportPlatoRepository';
import { ImportPlatoService } from '@/services/User/Product/ImportPlatoService';
import { createAiProvider } from '@/services/AI/AiProviderFactory';

const importRepository = new ImportPlatoRepository();
const importService = new ImportPlatoService(importRepository, createAiProvider());

export async function GET(request, { params }) {
    const user = await authorizeRequest(request);

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const job = await importService.getJob(id);

        if (job.restaurantId !== user.auth.restaurantId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        return NextResponse.json({
            status: true,
            job: {
                id: job.id,
                fileName: job.fileName,
                totalRows: job.totalRows,
                successCount: job.successCount,
                errorCount: job.errorCount,
                status: job.status,
                errors: job.errors,
                finishedAt: job.finishedAt,
                createdAt: job.createdAt,
            },
        });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}