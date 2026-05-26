import { ICategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class DeleteCategoriaIngredienteService {
    constructor(private repository: ICategoriaIngrediente) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
