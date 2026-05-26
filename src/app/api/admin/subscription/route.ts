import { NextResponse } from 'next/server';
import { AllSubscriptionRepository } from '@/repositories/admin/Subscription/AllSubscriptionRepository';
import { AllSubscriptionService } from '@/services/admin/Subscription/AllSubscriptionService';
import { authorizeAdmin } from '@/libs/authAdmin';

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const repository = new AllSubscriptionRepository();
        const service = new AllSubscriptionService(repository);
        const subscriptions = await service.execute();
        return NextResponse.json({ status: true, subscriptions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
