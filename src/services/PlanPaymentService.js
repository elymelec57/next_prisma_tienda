export class PlanPaymentService {
    constructor(planPaymentRepository) {
        this.planPaymentRepository = planPaymentRepository;
    }

    async getAllPayments() {
        return await this.planPaymentRepository.findAll();
    }

    async processPaymentAction(paymentId, action) {
        const payment = await this.planPaymentRepository.findById(paymentId);

        if (!payment) {
            throw new Error("Payment not found");
        }

        if (action === "CONFIRMED") {
            await this.planPaymentRepository.updateStatus(paymentId, "CONFIRMED");

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            await this.planPaymentRepository.upsertSubscription({
                restaurantId: payment.restaurantId,
                planId: payment.planId,
                startDate: new Date(),
                endDate: endDate,
                status: "active"
            });

            return { message: "Payment accepted and subscription updated" };
        } else if (action === "REJECTED") {
            await this.planPaymentRepository.updateStatus(paymentId, "REJECTED");
            return { message: "Payment denied" };
        }

        throw new Error("Invalid action");
    }
}
