import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
        return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    try {
        const schedules = await prisma.schedule.findMany({
            where: {
                restaurantId: parseInt(restaurantId),
            },
        });
        return NextResponse.json(schedules);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newSchedule = await prisma.schedule.create({
            data,
        });
        return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}
