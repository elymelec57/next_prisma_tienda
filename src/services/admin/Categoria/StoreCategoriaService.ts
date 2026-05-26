import { ICategoria, Categoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class StoreCategoriaService {
    constructor(private repository: ICategoria) {}

    async execute(data: Categoria) {
        return await this.repository.create(data);
    }
}
