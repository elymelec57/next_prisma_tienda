import { ICategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class GetCategoriaIngredienteService {
    constructor(private repository: ICategoriaIngrediente) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
