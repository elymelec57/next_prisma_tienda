import { IAllPlanPayment } from "@/interfaces/admin/PlanPayment/PlanPaymentInterface";

export class AllPlanPaymentService {
    constructor(private repository: IAllPlanPayment) {}

    async execute() {
        return await this.repository.all();
    }
}
