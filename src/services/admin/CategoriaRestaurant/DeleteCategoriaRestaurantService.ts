import { ICategoriaRestaurant } from "@/interfaces/admin/CategoriaRestaurant/CategoriaRestaurantInterface";

export class DeleteCategoriaRestaurantService {
    constructor(private repository: ICategoriaRestaurant) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
