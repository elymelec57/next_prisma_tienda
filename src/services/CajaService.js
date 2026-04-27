import { CajaRepository } from "@/repositories/CajaRepository";

export class CajaService {
    constructor() {
        this.cajaRepository = new CajaRepository();
    }

    async createCaja(data) {
        return await this.cajaRepository.create(data);
    }

    async updateCaja(id, data) {
        return await this.cajaRepository.update(id, data);
    }

    async deleteCaja(id) {
        return await this.cajaRepository.delete(id);
    }

    async getCajaById(id) {
        return await this.cajaRepository.findById(id);
    }

    async getCajasByRestaurant(restaurantId) {
        return await this.cajaRepository.findByRestaurant(restaurantId);
    }

    async openShift(data) {
        return await this.cajaRepository.openShift(data);
    }

    async closeShift(id, data) {
        return await this.cajaRepository.closeShift(id, data);
    }
}
