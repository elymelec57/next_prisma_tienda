import { IRestaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class DeleteRestaurantService {
    constructor(private repository: IRestaurant) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
