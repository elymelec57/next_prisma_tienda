import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/libs/auth';
import { SubscriptionRepository } from '@/repositories/User/Business/Subscription/SubscriptionRepository';
import { SubscriptionService } from '@/services/User/Business/Subscription/SubscriptionService';
import { StoreSubscriptionService } from '@/services/User/Business/Subscription/StoreSubscriptionService';
import { SaveImageVercelService } from '@/services/Shared/File/SaveImageVercelService';

const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

const saveImageVercelService = new SaveImageVercelService();
const storeSubscriptionService = new StoreSubscriptionService(subscriptionRepository, saveImageVercelService);

export async function GET(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { subscription, availablePlans } = await subscriptionService.getSubscriptionData(user.auth.id);

    return NextResponse.json({
        subscription,
        availablePlans,
    });
}

export async function POST(request) {
    const user = await authorizeRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const form = JSON.parse(formData.get('form'));
    const image = formData.get('image');
    const { planId, paymentMethod, transactionId, idpotencia } = form;

    const { subscription, payment, message } = await storeSubscriptionService.execute(user.auth.id, planId, paymentMethod, transactionId, image, idpotencia);

    return NextResponse.json({ status: true, payment, message });
}
