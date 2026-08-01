import { NextResponse } from "next/server";
import { authorizeRequest } from "@/libs/auth";
import { PaymentMethodRepository } from "@/repositories/User/Business/PaymentMethod/PaymentMethodRepository";
import { PaymentMethodService } from "@/services/User/Business/PaymentMethod/PaymentMethodService";

const paymentMethodService = new PaymentMethodService(new PaymentMethodRepository());

export async function GET(request: Request) {

    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
        return NextResponse.json({ status: false, message: "Restaurant ID required" }, { status: 400 });
    }

    try {
        const paymentMethods = await paymentMethodService.getPaymentMethodsByRestaurant(restaurantId);
        return NextResponse.json({ status: true, data: paymentMethods });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {

    const user = await authorizeRequest(request);
    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const { restaurantId, paymentMethod } = await request.json();
        const newPaymentMethod = await paymentMethodService.createPaymentMethod(restaurantId, paymentMethod);

        return NextResponse.json({ status: true, message: "Payment method created", data: newPaymentMethod });
    } catch (error: any) {
        console.error("Error creating payment method:", error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
