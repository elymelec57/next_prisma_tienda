import { MesaInterface } from '@/interfaces/User/Mesa/MesaInterface';

export class MesaService {
    constructor(private readonly mesaRepository: MesaInterface) { }

    async getMesasByUserId(userId: number, sucursalId: number | string) {
        const restaurant = await this.mesaRepository.findRestaurantByUserId(userId);
        if (!restaurant) {
            return null;
        }
        if (sucursalId === 'main') {
            return await this.mesaRepository.findAllByRestaurantId(restaurant.id);
        } else {
            return await this.mesaRepository.findAllByRestaurantIdAndSucursalId(restaurant.id, Number(sucursalId));
        }
    }
}
