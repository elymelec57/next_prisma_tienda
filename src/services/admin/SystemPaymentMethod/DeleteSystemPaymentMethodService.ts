import { ISystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class DeleteSystemPaymentMethodService {
    constructor(private repository: ISystemPaymentMethod) {}

    async execute(id: string) {
        return await this.repository.delete(id);
    }
}
