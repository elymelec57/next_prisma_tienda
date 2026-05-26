import { ISystemPaymentMethod, SystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class StoreSystemPaymentMethodService {
    constructor(private repository: ISystemPaymentMethod) {}

    async execute(data: SystemPaymentMethod) {
        return await this.repository.create(data);
    }
}
