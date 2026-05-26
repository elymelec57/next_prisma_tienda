import { ICategoriaIngrediente, CategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class StoreCategoriaIngredienteService {
    constructor(private repository: ICategoriaIngrediente) {}

    async execute(data: CategoriaIngrediente) {
        return await this.repository.create(data);
    }
}
