export interface CajaStatsByMethod {
    [method: string]: number;
}

export interface CajaStatsResult {
    totalIncome: number;
    count: number;
    byMethod: CajaStatsByMethod;
    currency: string;
}

export interface IGetCajaStats {
    getStats(restaurantId: number): Promise<CajaStatsResult>;
}
