import { NextResponse } from 'next/server';
import { SubscriptionRepository } from '@/repositories/SubscriptionRepository';
import { SubscriptionService } from '@/services/SubscriptionService';
import { authorizeRequest } from '@/libs/auth';

const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

async function checkAdmin(request) {
    const user = await authorizeRequest(request);
    if (!user || !user.auth.roles.some(role => role.name.toLowerCase() === 'admin')) {
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
