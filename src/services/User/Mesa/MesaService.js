export class MesaService {
    constructor(mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    async getMesasByUserId(userId) {
        const restaurant = await this.mesaRepository.findRestaurantByUserId(userId);
        if (!restaurant) {
            return null;
        }
        return await this.mesaRepository.findAllByRestaurantId(restaurant.id);
    }
}
