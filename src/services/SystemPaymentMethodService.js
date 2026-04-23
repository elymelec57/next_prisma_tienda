export class SystemPaymentMethodService {
    constructor(systemPaymentMethodRepository) {
        this.systemPaymentMethodRepository = systemPaymentMethodRepository;
    }

    async getAllPaymentMethods() {
        return await this.systemPaymentMethodRepository.findAll();
    }

    async getPaymentMethodById(id) {
        return await this.systemPaymentMethodRepository.findById(id);
    }

    async createPaymentMethod(data) {
        return await this.systemPaymentMethodRepository.create(data);
    }

    async updatePaymentMethod(id, data) {
        return await this.systemPaymentMethodRepository.update(id, data);
    }

    async deletePaymentMethod(id) {
        return await this.systemPaymentMethodRepository.delete(id);
    }
}
