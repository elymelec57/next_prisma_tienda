import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { GetCajaStatsRepository } from '@/repositories/User/Caja/GetCajaStatsRepository';
import { GetCajaStatsService } from '@/services/User/Caja/GetCajaStatsService';

async function getRestaurantId(): Promise<number | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as any;
        return decoded.data.restaurantId;
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const restaurantId = await getRestaurantId();
        if (!restaurantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const repository = new GetCajaStatsRepository();
        const service = new GetCajaStatsService(repository);
        const stats = await service.execute(restaurantId);
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
