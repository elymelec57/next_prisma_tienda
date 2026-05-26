import { ICategoria, Categoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class UpdateCategoriaService {
    constructor(private repository: ICategoria) {}

    async execute(id: number, data: Categoria) {
        return await this.repository.update(id, data);
    }
}
