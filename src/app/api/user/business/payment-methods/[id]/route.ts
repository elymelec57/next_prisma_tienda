import { NextResponse } from "next/server";
import { PaymentMethodRepository } from "@/repositories/User/Business/PaymentMethod/PaymentMethodRepository";
import { PaymentMethodService } from "@/services/User/Business/PaymentMethod/PaymentMethodService";

const paymentMethodService = new PaymentMethodService(new PaymentMethodRepository());

export async function PUT(request: Request, segmentData: any) {
    try {
        const params = await segmentData.params;
        const { paymentMethod } = await request.json();

        const updated = await paymentMethodService.updatePaymentMethod(params.id, paymentMethod);

        return NextResponse.json({ status: true, message: "Payment method updated", data: updated });
    } catch (error: any) {
        console.error("Error updating payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(_request: Request, segmentData: any) {
    try {
        const params = await segmentData.params;
        await paymentMethodService.deletePaymentMethod(params.id);
        return NextResponse.json({ status: true, message: "Payment method deleted" });
    } catch (error: any) {
        console.error("Error deleting payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
