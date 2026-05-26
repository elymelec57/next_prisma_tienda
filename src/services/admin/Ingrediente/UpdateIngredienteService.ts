import { IIngrediente, Ingrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class UpdateIngredienteService {
    constructor(private repository: IIngrediente) {}

    async execute(id: number, data: Ingrediente) {
        return await this.repository.update(id, data);
    }
}
