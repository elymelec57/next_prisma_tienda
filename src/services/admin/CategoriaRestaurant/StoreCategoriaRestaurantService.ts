import { ICategoriaRestaurant, CategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class StoreCategoriaRestaurantService {
    constructor(private repository: ICategoriaRestaurant) {}

    async execute(data: CategoriaRestaurant) {
        return await this.repository.create(data);
    }
}
