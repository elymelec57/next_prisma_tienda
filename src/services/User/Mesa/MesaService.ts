import { MesaInterface } from '@/interfaces/User/Mesa/MesaInterface';

export class MesaService {
    constructor(private readonly mesaRepository: MesaInterface) { }

    async getMesasByUserId(userId: number) {
        const restaurant = await this.mesaRepository.findRestaurantByUserId(userId);
        if (!restaurant) {
            return null;
        }
        return await this.mesaRepository.findAllByRestaurantId(restaurant.id);
    }
}
