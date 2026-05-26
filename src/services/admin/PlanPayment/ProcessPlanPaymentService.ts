import { IPlanPayment } from "@/interfaces/admin/PlanPayment/PlanPaymentInterface";

export class ProcessPlanPaymentService {
    constructor(private repository: IPlanPayment) {}

    async execute(id: number, action: string) {
        const payment = await this.repository.findById(id);

        if (!payment) {
            throw new Error('Pago no encontrado');
        }

        if (payment.status !== 'PENDING') {
            throw new Error(`Este pago ya ha sido procesado como ${payment.status}`);
        }

        if (action === 'approve') {
            // Logic moved from PlanPaymentService.js
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + (payment.plan.duration || 30));

            await this.repository.update(id, {
                status: 'APPROVED',
                processedAt: new Date()
            });

            await this.repository.createSubscription({
                restaurantId: payment.restaurantId,
                planId: payment.planId,
                startDate,
                endDate,
                status: 'ACTIVE'
            });

            return { message: 'Pago aprobado y suscripción activada' };
        } else if (action === 'reject') {
            await this.repository.update(id, {
                status: 'REJECTED',
                processedAt: new Date()
            });
            return { message: 'Pago rechazado' };
        } else {
            throw new Error('Acción no válida');
        }
    }
}
