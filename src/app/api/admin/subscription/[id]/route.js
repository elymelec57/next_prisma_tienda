import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request, segmentData) {
    try {
        const { id } = await segmentData.params;
        const { body } = await request.json();
        const { action } = body;

        if (!action || !["CONFIRMED", "REJECTED"].includes(action)) {
            return NextResponse.json({ status: false, message: "Invalid action" }, { status: 400 });
        }

        const paymentId = parseInt(id);

        if (isNaN(paymentId)) {
            return NextResponse.json({ status: false, message: "Invalid payment ID" }, { status: 400 });
        }

        const payment = await prisma.planPayment.findUnique({
            where: { id: paymentId },
            include: { plan: true }
        });

        if (!payment) {
            return NextResponse.json({ status: false, message: "Payment not found" }, { status: 404 });
        }

        if (action === "CONFIRMED") {
            // Update payment status
            await prisma.planPayment.update({
                where: { id: paymentId },
                data: { status: "CONFIRMED" }
            });

            // Calculate end date (e.g., 30 days from now)
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            // Update or create subscription
            await prisma.subscription.upsert({
                where: { restaurantId: payment.restaurantId },
                update: {
                    planId: payment.planId,
                    startDate: new Date(),
                    endDate: endDate,
                    status: "active"
                },
                create: {
                    restaurantId: payment.restaurantId,
                    planId: payment.planId,
                    startDate: new Date(),
                    endDate: endDate,
                    status: "active"
                }
            });

            return NextResponse.json({ status: true, message: "Payment accepted and subscription updated" });
        } else if (action === "REJECTED") {
            // Update payment status
            await prisma.planPayment.update({
                where: { id: paymentId },
                data: { status: "REJECTED" }
            });

            return NextResponse.json({ status: true, message: "Payment denied" });
        }

    } catch (error) {
        console.error("Error updating payment status:", error);
        return NextResponse.json({ status: false, message: "Error updating payment status" }, { status: 500 });
    }
}
