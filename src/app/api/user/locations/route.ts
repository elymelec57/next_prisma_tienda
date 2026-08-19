import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma';

export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            include: {
                states: {
                    include: {
                        cities: true
                    }
                }
            }
        });
        return NextResponse.json({ status: true, data: countries });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}
