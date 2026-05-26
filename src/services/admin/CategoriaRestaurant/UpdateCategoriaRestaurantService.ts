import { ICategoriaRestaurant, CategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class UpdateCategoriaRestaurantService {
    constructor(private repository: ICategoriaRestaurant) {}

    async execute(id: number, data: CategoriaRestaurant) {
        return await this.repository.update(id, data);
    }
}
