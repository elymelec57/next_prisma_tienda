import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");
    const restaurantSlug = searchParams.get("slug");

    if (!identifier || !restaurantSlug) {
        return NextResponse.json({ status: false, message: "Faltan parámetros" }, { status: 400 });
    }

    try {
        const restaurant = await prisma.restaurant.findFirst({
            where: { slug: restaurantSlug }
        });

        if (!restaurant) {
            return NextResponse.json({ status: false, message: "Restaurante no encontrado" }, { status: 404 });
        }

        const client = await prisma.cliente.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { telefono: identifier }
                ]
            }
        });

        if (client) {
            return NextResponse.json({
                status: true,
                client: {
                    id: client.id,
                    nombre: client.nombre,
                    email: client.email,
                    telefono: client.telefono
                }
            });
        } else {
            return NextResponse.json({ status: false, message: "Cliente no encontrado" });
        }
    } catch (error) {
        console.error("Error searching client:", error);
        return NextResponse.json({ status: false, message: "Error interno" }, { status: 500 });
    }
}
