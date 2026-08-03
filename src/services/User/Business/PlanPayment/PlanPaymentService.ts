import { IPlanPaymentRepository, IPlanPayment } from "@/interfaces/User/Business/PlanPayment/IPlanPaymentRepository";

export class PlanPaymentService {
    constructor(private readonly planPaymentRepository: IPlanPaymentRepository) { }

    async getPaymentsByUser(userId: number): Promise<IPlanPayment[]> {
        if (!userId) {
            throw new Error("userId is required");
        }
        return await this.planPaymentRepository.findByUserId(userId);
    }
}
