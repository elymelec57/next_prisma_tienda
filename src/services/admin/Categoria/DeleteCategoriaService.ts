import { ICategoria } from "@/interfaces/admin/Categoria/CategoriaInterface";

export class DeleteCategoriaService {
    constructor(private repository: ICategoria) {}

    async execute(id: number) {
        return await this.repository.delete(id);
    }
}
