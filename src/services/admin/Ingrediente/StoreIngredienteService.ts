import { IIngrediente, Ingrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class StoreIngredienteService {
    constructor(private repository: IIngrediente) {}

    async execute(data: Ingrediente) {
        return await this.repository.create(data);
    }
}
