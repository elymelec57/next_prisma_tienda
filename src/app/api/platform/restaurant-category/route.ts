import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
    try {
        const categorias = await prisma.categoriaRestaurant.findMany();
        return NextResponse.json({ status: true, categorias });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}