import { IRestaurant, Restaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class StoreRestaurantService {
    constructor(private repository: IRestaurant) {}

    async execute(data: Restaurant) {
        return await this.repository.create(data);
    }
}
