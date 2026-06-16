import { IUpdateOrderStatus } from "@/interfaces/User/Order/UpdateOrderStatusInterface";

export class UpdateOrderStatusService {
    constructor(
        private updateOrderStatus: IUpdateOrderStatus,
    ) { }

    async execute(id: number, estado: string, mesaId?: number) {
        return this.updateOrderStatus.updateOrderStatus(id, estado, mesaId);
    }
}
