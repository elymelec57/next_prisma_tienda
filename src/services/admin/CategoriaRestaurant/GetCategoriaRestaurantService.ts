import { ICategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class GetCategoriaRestaurantService {
    constructor(private repository: ICategoriaRestaurant) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
