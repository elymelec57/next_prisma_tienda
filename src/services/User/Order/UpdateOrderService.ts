import { IUpdateOrder, UpdateOrderData } from "@/interfaces/User/Order/UpdateOrderInterface";

export class UpdateOrderService {
    constructor(
        private updateOrder: IUpdateOrder,
    ) { }

    async execute(id: number, data: UpdateOrderData) {
        return this.updateOrder.updateOrder(id, data);
    }
}
