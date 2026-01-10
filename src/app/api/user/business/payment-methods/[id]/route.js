import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, segmentData) {
    try {
        const params = await segmentData.params;
        const { paymentMethod } = await request.json();

        const updated = await prisma.paymentMethod.update({
            where: {
                id: params.id,
            },
            data: paymentMethod,
        });

        return NextResponse.json({ status: true, message: "Payment method updated", data: updated });
    } catch (error) {
        console.error("Error updating payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request, segmentData) {
    try {
        const params = await segmentData.params;

        await prisma.paymentMethod.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json({ status: true, message: "Payment method deleted" });
    } catch (error) {
        console.error("Error deleting payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
