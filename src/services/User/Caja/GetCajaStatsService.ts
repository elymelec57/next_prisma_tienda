import { IGetCajaStats, CajaStatsResult } from '@/interfaces/User/Caja/GetCajaStatsInterface';

export class GetCajaStatsService {
    constructor(private getCajaStatsRepository: IGetCajaStats) {}

    async execute(restaurantId: number): Promise<CajaStatsResult> {
        return this.getCajaStatsRepository.getStats(restaurantId);
    }
}
