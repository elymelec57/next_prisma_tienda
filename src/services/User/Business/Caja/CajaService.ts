import {
    ICajaRepository,
    ICreateCajaData,
    IUpdateCajaData,
    IOpenShiftData,
    ICloseShiftData,
    ICaja,
    ITurnoCaja
} from "@/interfaces/User/Business/Caja/ICajaRepository";

export class CajaService {
    constructor(private readonly cajaRepository: ICajaRepository) {}

    async createCaja(data: ICreateCajaData): Promise<ICaja> {
        return await this.cajaRepository.create(data);
    }

    async updateCaja(id: number | string, data: IUpdateCajaData): Promise<ICaja> {
        return await this.cajaRepository.update(id, data);
    }

    async deleteCaja(id: number | string): Promise<ICaja> {
        return await this.cajaRepository.delete(id);
    }

    async getCajaById(id: number | string): Promise<ICaja | null> {
        return await this.cajaRepository.findById(id);
    }

    async getCajasByRestaurant(restaurantId: number | string): Promise<ICaja[]> {
        return await this.cajaRepository.findByRestaurant(restaurantId);
    }

    async openShift(data: IOpenShiftData): Promise<ITurnoCaja> {
        return await this.cajaRepository.openShift(data);
    }

    async closeShift(id: number | string, data: ICloseShiftData): Promise<ITurnoCaja> {
        return await this.cajaRepository.closeShift(id, data);
    }
}
