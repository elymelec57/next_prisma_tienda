import { IRestaurant, Restaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class UpdateRestaurantService {
    constructor(private repository: IRestaurant) {}

    async execute(id: number, data: Restaurant) {
        return await this.repository.update(id, data);
    }
}
