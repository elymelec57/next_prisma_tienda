import { ICategoriaIngrediente, CategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class UpdateCategoriaIngredienteService {
    constructor(private repository: ICategoriaIngrediente) {}

    async execute(id: number, data: CategoriaIngrediente) {
        return await this.repository.update(id, data);
    }
}
