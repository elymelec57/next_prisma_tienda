import { IAllRestaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class AllRestaurantService {
    constructor(private repository: IAllRestaurant) {}

    async execute() {
        return await this.repository.all();
    }
}
