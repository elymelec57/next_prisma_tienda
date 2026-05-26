import { IAllCategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class AllCategoriaRestaurantService {
    constructor(private repository: IAllCategoriaRestaurant) {}

    async execute() {
        return await this.repository.all();
    }
}
