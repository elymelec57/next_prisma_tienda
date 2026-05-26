import { IAllIngrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class AllIngredienteService {
    constructor(private repository: IAllIngrediente) {}

    async execute() {
        return await this.repository.all();
    }
}
