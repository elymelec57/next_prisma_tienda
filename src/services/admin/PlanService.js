export class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
    }

    async getAllPlans() {
        return await this.planRepository.findAll();
    }

    async getPlanById(id) {
        return await this.planRepository.findById(id);
    }

    async createPlan(data) {
        return await this.planRepository.create(data);
    }

    async updatePlan(id, data) {
        return await this.planRepository.update(id, data);
    }

    async deletePlan(id) {
        return await this.planRepository.delete(id);
    }
}
