export class StoreMesaService {
    constructor(mesaRepository, storeMesaRepository) {
        this.mesaRepository = mesaRepository;
        this.storeMesaRepository = storeMesaRepository;
    }

    async createMesa(userId, data) {
        const restaurant = await this.mesaRepository.findRestaurantByUserId(userId);
        if (!restaurant) {
            return null;
        }

        return await this.storeMesaRepository.create({
            ...data,
            restaurantId: restaurant.id
        });
    }
}
