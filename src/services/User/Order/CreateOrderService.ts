import { ICreateOrder, CreateOrderData } from '@/interfaces/User/Order/CreateOrderInterface';

export class CreateOrderService {
    constructor(
        private createOrderRepository: ICreateOrder,
    ) { }

    async execute(data: CreateOrderData): Promise<any> {
        return this.createOrderRepository.createOrder(data);
    }
}
