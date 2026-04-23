export class SubscriptionService {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    async getAllSubscriptions() {
        return await this.subscriptionRepository.findAll();
    }

    async getSubscriptionById(id) {
        return await this.subscriptionRepository.findById(id);
    }

    async createSubscription(data) {
        return await this.subscriptionRepository.create(data);
    }

    async updateSubscription(id, data) {
        return await this.subscriptionRepository.update(id, data);
    }

    async deleteSubscription(id) {
        return await this.subscriptionRepository.delete(id);
    }
}
