import { IPayOrder, PayOrderData, PayOrderResult } from '@/interfaces/User/Caja/PayOrderInterface';

export class PayOrderService {
    constructor(private payOrderRepository: IPayOrder) {}

    async execute(data: PayOrderData): Promise<PayOrderResult> {
        return this.payOrderRepository.payOrder(data);
    }
}
