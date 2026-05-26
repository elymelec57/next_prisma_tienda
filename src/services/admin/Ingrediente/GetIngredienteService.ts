import { IIngrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class GetIngredienteService {
    constructor(private repository: IIngrediente) {}

    async execute(id: number) {
        return await this.repository.findById(id);
    }
}
