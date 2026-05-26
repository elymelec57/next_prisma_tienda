import { IIngrediente } from "@/interfaces/admin/Ingrediente/IngredienteInterface";

export class DeleteIngredienteService {
    constructor(private repository: IIngrediente) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
