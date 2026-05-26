import { ISystemPaymentMethod, SystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class UpdateSystemPaymentMethodService {
    constructor(private repository: ISystemPaymentMethod) {}

    async execute(id: string, data: SystemPaymentMethod) {
        return await this.repository.update(id, data);
    }
}
