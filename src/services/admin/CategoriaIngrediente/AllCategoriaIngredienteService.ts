import { IAllCategoriaIngrediente } from "@/interfaces/admin/CategoriaIngrediente/CategoriaIngredienteInterface";

export class AllCategoriaIngredienteService {
    constructor(private repository: IAllCategoriaIngrediente) {}

    async execute() {
        return await this.repository.all();
    }
}
