import { IRestaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class GetRestaurantService {
    constructor(private repository: IRestaurant) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
