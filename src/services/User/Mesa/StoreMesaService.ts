import { StoreMesaInterface } from '@/interfaces/User/Mesa/StoreMesaInterface';

export class StoreMesaService {
    constructor(private readonly storeMesaRepository: StoreMesaInterface) {
    }

    async createMesa(userId: number, data: any, selectedSucursal: any) {
        const restaurant = await this.storeMesaRepository.findRestaurantByUserId(userId);
        if (!restaurant) {
            return null;
        }

        return await this.storeMesaRepository.create({
            ...data,
            restaurantId: restaurant.id,
            sucursalId: selectedSucursal.id !== "main" ? selectedSucursal.id : undefined
        });
    }
}
