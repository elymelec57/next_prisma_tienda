export class RestaurantService {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    async getAllRestaurants() {
        return await this.restaurantRepository.findAll();
    }

    async getRestaurantById(id) {
        return await this.restaurantRepository.findById(id);
    }

    async createRestaurant(data) {
        return await this.restaurantRepository.create(data);
    }

    async updateRestaurant(id, data) {
        return await this.restaurantRepository.update(id, data);
    }

    async deleteRestaurant(id) {
        return await this.restaurantRepository.delete(id);
    }
}
