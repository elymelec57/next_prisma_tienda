import { ISystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class GetSystemPaymentMethodService {
    constructor(private repository: ISystemPaymentMethod) {}

    async execute(id: string) {
        return await this.repository.findById(id);
    }
}
