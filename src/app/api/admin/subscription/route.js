import { NextResponse } from 'next/server';
import { SubscriptionRepository } from '@/repositories/admin/SubscriptionRepository';
import { SubscriptionService } from '@/services/admin/SubscriptionService';
import { authorizeAdmin } from '@/libs/authAdmin';

const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

async function checkAdmin(request) {
    const admin = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        return NextResponse.json({ status: true, subscriptions });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
