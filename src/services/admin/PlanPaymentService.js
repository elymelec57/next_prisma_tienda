export class PlanPaymentService {
    constructor(planPaymentRepository) {
        this.planPaymentRepository = planPaymentRepository;
    }

    async getAllPayments() {
        return await this.planPaymentRepository.findAll();
    }

    async processPaymentAction(id, action) {
        const payment = await this.planPaymentRepository.findById(id);

        if (!payment) {
            throw new Error('Pago no encontrado');
        }

        if (action === 'approve') {
            await this.planPaymentRepository.updateStatus(id, 'approved');

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + (payment.plan.duration || 30));

            await this.planPaymentRepository.upsertSubscription({
                restaurantId: payment.restaurantId,
                planId: payment.planId,
                startDate,
                endDate,
                status: 'active'
            });

            return { message: 'Pago aprobado y suscripción actualizada' };
        } else if (action === 'reject') {
            await this.planPaymentRepository.updateStatus(id, 'rejected');
            return { message: 'Pago rechazado' };
        } else {
            throw new Error('Acción no válida');
        }
    }
}
