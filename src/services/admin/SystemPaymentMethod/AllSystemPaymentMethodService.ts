import { IAllSystemPaymentMethod } from "@/interfaces/admin/SystemPaymentMethod/SystemPaymentMethodInterface";

export class AllSystemPaymentMethodService {
    constructor(private repository: IAllSystemPaymentMethod) {}

    async execute() {
        return await this.repository.all();
    }
}
