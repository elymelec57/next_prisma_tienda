export interface PayOrderData {
    orderId: number;
    paymentMethodId: number;
    monto: number;
    restaurantId: number;
}

export interface PayOrderResult {
    updatedOrder: any;
    payment: any;
}

export interface IPayOrder {
    payOrder(data: PayOrderData): Promise<PayOrderResult>;
}
